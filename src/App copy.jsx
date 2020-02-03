import React, { Component } from 'react';
import MapGL, { Popup, GeolocateControl } from 'react-map-gl';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setShops } from './redux/shop/shop.actions';
import { selectShops } from './redux/shop/shop.selectors';
import './App.css';
import ShopIndicator from './components/map/shop-indicator';
import ShopInfo from './components/map/shop-info';
import Header from './components/header/header';
import Footer from './components/footer/footer';

const TOKEN =
  'pk.eyJ1Ijoib3p6eWNvZGUiLCJhIjoiY2s2MXhpbmdmMDdwejNrbW14eXJvaTYxayJ9.lwAX0SNCShN0GZqtmuLrmw';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 3.89725,
        longitude: 7.377746,
        zoom: 7,
        bearing: 1,
        pitch: 30
      },
      popupInfo: null,
      location: 'Ayegun',
      error: null,
      has_ride: false,
      destination: null,
      driver: null,
      origin: {
        name: 'Ayetoro',
        latitude: 'response_latitude',
        longitude: 'response.longitude'
      },
      is_searching: false,
      has_ridden: false
    };
    this.username = 'wernancheta';
    this.available_drivers_channel = null;
    this.bookRide = this.bookRide.bind(this);
    this.user_ride_channel = null;
  }
  updateViewport = viewport => {
    this.setState({ viewport });
  };

  handleClickMarker = shop => {
    this.setState({ popupInfo: shop });
  };

  handleShowPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.location.coordinates[0]}
          latitude={popupInfo.location.coordinates[1]}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <ShopInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  bookRide() {
    this.setState({
      is_searching: true,
      destination: {
        name: 'Ayetoro',
        latitude: 'response_latitude',
        longitude: 'response.longitude'
      }
    });

    let pickup_data = {
      name: this.state.origin.name,
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude
    };

    let dropoff_data = {
      name: 'Ayetoro',
      latitude: 'response_latitude',
      longitude: 'response.longitude'
    };

    this.available_drivers_channel.trigger('client-driver-request', {
      username: this.username,
      pickup: pickup_data,
      dropoff: dropoff_data
    });
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        this.setState({
          viewport: {
            latitude: lat,
            longitude: long,
            zoom: 11,
            bearing: 1,
            pitch: 30
          }
        });
      });
    }
    fetch(`https://hairdresser-app.herokuapp.com/api/v1/shops`)
      .then(res => res.json())
      .then(res => {
        this.props.setShops(res.data.shops);
      });
    const pusher = new Pusher('bfa794d9a749bee1f67d', {
      authEndpoint: 'http://localhost:5000/pusher/auth',
      cluster: 'eu',
      encrypted: true
    });
    this.available_drivers_channel = pusher.subscribe(
      'private-available-drivers'
    );

    this.user_ride_channel = pusher.subscribe('private-ride-' + this.username);

    this.user_ride_channel.bind('client-driver-response', data => {
      let passenger_response = 'no';
      if (!this.state.has_ride) {
        passenger_response = 'yes';
      }

      // passenger responds to driver's response
      this.user_ride_channel.trigger('client-driver-response', {
        response: passenger_response
      });
    });

    this.user_ride_channel.bind('client-found-driver', data => {
      // found driver, the passenger has no say about this.
      // once a driver is found, this will be the driver that's going to drive the user
      // to their destination
      // let region = regionFrom(
      // 	data.location.latitude,
      // 	data.location.longitude,
      // 	data.location.accuracy
      // );

      this.setState({
        has_ride: true,
        is_searching: false,
        // location: region,
        driver: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          accuracy: data.location.accuracy
        }
      });

      alert(
        'Orayt!',
        'We found you a driver. \nName: ' +
          data.driver.name +
          '\nCurrent location: ' +
          data.location.name,
        [
          {
            text: 'Sweet!'
          }
        ],
        { cancelable: false }
      );
    });

    this.user_ride_channel.bind('client-driver-location', data => {
      // driver location received
      // let region = regionFrom(
      //   data.latitude,
      //   data.longitude,
      //   data.accuracy
      // );

      this.setState({
        // location: region,
        driver: {
          latitude: data.latitude,
          longitude: data.longitude
        }
      });
    });

    this.user_ride_channel.bind('client-driver-message', data => {
      if (data.type === 'near_pickup') {
        //remove passenger marker
        this.setState({
          has_ridden: true
        });
      }

      if (data.type === 'near_dropoff') {
        this._setCurrentLocation();
      }

      alert(
        data.title,
        data.msg,
        [
          {
            text: 'Aye sir!'
          }
        ],
        { cancelable: false }
      );
    });
  }

  render() {
    const { viewport } = this.state;
    return window.innerWidth < 500 ? (
      <div className="App">
        <Header />
        <MapGL
          {...viewport}
          width="100vw"
          height="100vh"
          // mapStyle="mapbox://styles/mapbox/dark-v10"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={this.updateViewport}
          mapboxApiAccessToken={TOKEN}
        >
          <ShopIndicator
            data={this.props.shops}
            onClick={this.handleClickMarker}
          />
          {this.handleShowPopup()}
          <div className="geolocate">
            <GeolocateControl positionOptions={{ enableHighAccuracy: true }} />
          </div>
        </MapGL>
        <Footer handleClick={this.bookRide} />
      </div>
    ) : (
      <h1>Only available on smartfone screen size</h1>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  shops: selectShops
});
const mapDispatchToProps = dispatch => ({
  setShops: shops => dispatch(setShops(shops))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
