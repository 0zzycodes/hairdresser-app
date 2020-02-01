import React, { Component } from 'react';
import MapGL, { Popup, GeolocateControl } from 'react-map-gl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setShops } from './redux/shop/shop.actions';
import { selectShops } from './redux/shop/shop.selectors';
import './App.css';
import ShopIndicator from './components/map/shop-indicator';
import ShopInfo from './components/map/shop-info';

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
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
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
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        this.setState({
          viewport: {
            latitude: lat,
            longitude: long,
            zoom: 7,
            bearing: 0,
            pitch: 0
          }
        });
      });
    }
    fetch(`https://hairdresser-app.herokuapp.com/api/v1/shops`)
      .then(res => res.json())
      .then(res => {
        this.props.setShops(res.data.shops);
      });
  }

  render() {
    const { viewport } = this.state;
    return (
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        // mapStyle="mapbox://styles/mapbox/dark-v10"
        mapStyle="mapbox://styles/mapbox/streets-v10"
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
