import React, { Component } from 'react';
import MapGL, { Popup, GeolocateControl } from 'react-map-gl';
import './App.css';

import Pins from './components/map/shop-indicator';
import CityInfo from './components/map/shop-info';

import CITIES from './components/data/cities.json';

const TOKEN =
  'pk.eyJ1Ijoib3p6eWNvZGUiLCJhIjoiY2s2MXhpbmdmMDdwejNrbW14eXJvaTYxayJ9.lwAX0SNCShN0GZqtmuLrmw';

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 9,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
  }

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  _onClickMarker = city => {
    this.setState({ popupInfo: city });
  };

  _renderPopup() {
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

  render() {
    const { viewport } = this.state;

    return (
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        // mapStyle="mapbox://styles/mapbox/dark-v9"
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN}
      >
        <Pins data={CITIES} onClick={this._onClickMarker} />

        {this._renderPopup()}
        <div style={geolocateStyle}>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
        </div>
      </MapGL>
    );
  }
}
