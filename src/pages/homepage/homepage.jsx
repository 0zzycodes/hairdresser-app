import React, { Component } from 'react';
import MapGL, { Popup, GeolocateControl } from 'react-map-gl';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { setShops } from '../../redux/shop/shop.actions';
import { selectShops } from '../../redux/shop/shop.selectors';
import ShopIndicator from '../../components/map/shop-indicator';
import ShopInfo from '../../components/map/shop-info';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import loader from '../../assets/loader.gif';
import './homepage.scss';

const TOKEN =
  'pk.eyJ1Ijoib3p6eWNvZGUiLCJhIjoiY2s2MXhpbmdmMDdwejNrbW14eXJvaTYxayJ9.lwAX0SNCShN0GZqtmuLrmw';

class Homepage extends Component {
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
      message: null,
      got_hairdresser: false,
      hairdresser: null,
      is_searching: false,
      is_hair_start: false,
      is_hair_done: false
    };
    this.username = this.props.currentUser.name;
    this.available_hairdressers_channel = null;
    this.findHairdresser = this.findHairdresser.bind(this);
    this.user_hairD_channel = null;
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

  handleHairDone = () => {
    this.setState({
      popupInfo: null,
      message: null,
      got_hairdresser: false,
      hairdresser: null,
      is_searching: false,
      is_hair_start: false,
      is_hair_done: false
    });
    this.user_hairD_channel.trigger('client-hairdresser-message', {
      type: 'Done',
      title: `Thank You`,
      msg: 5
    });
    // this.user_hairD_channel.unbind('client-hairdresser-response');
  };

  findHairdresser() {
    this.setState({
      is_searching: true
    });

    this.available_hairdressers_channel.trigger('client-hairdresser-request', {
      username: this.username
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
      authEndpoint: 'https://hairdresser-app.herokuapp.com/pusher/auth',
      cluster: 'eu',
      encrypted: true
    });
    this.available_hairdressers_channel = pusher.subscribe(
      'private-available-hairdressers'
    );

    this.user_hairD_channel = pusher.subscribe(
      'private-hairD-' + this.username
    );

    this.user_hairD_channel.bind('client-hairdresser-response', data => {
      let client_response = 'no';
      if (!this.state.got_hairdresser) {
        client_response = 'yes';
      }

      // client responds to hairdresser's response
      this.user_hairD_channel.trigger('client-hairdresser-response', {
        response: client_response
      });
    });
    // CLIENT RECIVE THE INFO SENT BY THE HAIRDRESSER
    this.user_hairD_channel.bind('client-found-hairdresser', data => {
      this.setState({
        got_hairdresser: true,
        is_searching: false,
        hairdresser: {
          name: data.hairdresser.name
        }
      });
    });
    // this.available_hairdressers_channel = pusher.unsubscribe(
    //   'private-available-hairdressers'
    // );

    this.user_hairD_channel.bind('client-hairdresser-message', data => {
      if (data.type === 'STARTING') {
        //remove client marker
        this.setState({
          is_hair_start: true,
          message: data
        });
      }
    });
  }

  render() {
    const { viewport, is_searching, is_hair_start, hairdresser } = this.state;
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
            <GeolocateControl
              style={{ background: 'black', outline: 'none', border: 'none' }}
              positionOptions={{ enableHighAccuracy: true }}
            />
          </div>
        </MapGL>
        {is_searching ? (
          <div className="loader-container">
            <img src={loader} alt="Loader" />
          </div>
        ) : null}
        {hairdresser ? (
          <div className="start-container">
            <div className="start">
              <h3>
                Orayt! We found you a hairdresser. Name: {hairdresser.name}
              </h3>
              <button className="btn" onClick={this.handleHairDone}>
                Ayy
              </button>
            </div>
          </div>
        ) : null}
        {is_hair_start ? (
          <div className="start-container">
            <div className="start">
              <h3>{this.state.message.title}</h3>
              <h4>{this.state.message.msg}</h4>
              <button className="btn" onClick={this.handleHairDone}>
                Done
              </button>
            </div>
          </div>
        ) : null}
        <Footer handleClick={this.findHairdresser} />
      </div>
    ) : (
      <h1>Only available on smartfone screen size</h1>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  shops: selectShops
});
const mapDispatchToProps = dispatch => ({
  setShops: shops => dispatch(setShops(shops))
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
