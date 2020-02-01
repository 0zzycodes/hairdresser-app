import React, { Component } from 'react';
import MapGL, { Popup, GeolocateControl, Layer } from 'react-map-gl';
import './App.css';

import ShopIndicator from './components/map/shop-indicator';
import CityInfo from './components/map/shop-info';

import CITIES from './components/data/cities.json';

const TOKEN =
  'pk.eyJ1Ijoib3p6eWNvZGUiLCJhIjoiY2s2MXhpbmdmMDdwejNrbW14eXJvaTYxayJ9.lwAX0SNCShN0GZqtmuLrmw';
// const parkLayer = {
//   id: 'water',
//   source: 'mapbox-streets',
//   'source-layer': 'water',
//   type: 'fill',
//   paint: {
//     'fill-color': '#00ffff'
//   }
// };

export default class App extends Component {
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

  handleClickMarker = city => {
    this.setState({ popupInfo: city });
  };

  handleShowPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <CityInfo info={popupInfo} />
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
        <ShopIndicator data={CITIES} onClick={this.handleClickMarker} />

        {this.handleShowPopup()}
        <div className="geolocate">
          <GeolocateControl positionOptions={{ enableHighAccuracy: true }} />
        </div>
        {/* <Layer {...parkLayer} /> */}
      </MapGL>
    );
  }
}
