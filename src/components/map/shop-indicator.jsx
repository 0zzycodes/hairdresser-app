import React from 'react';
import { Marker } from 'react-map-gl';
import store from '../../assets/store.svg';

export default class ShopIndicator extends React.Component {
  render() {
    const { data, onClick } = this.props;

    return data.map((city, index) => (
      <Marker
        key={`marker-${index}`}
        longitude={city.longitude}
        latitude={city.latitude}
      >
        <img
          src={store}
          alt="indicatore"
          width="20px"
          height="20px"
          onClick={() => onClick(city)}
        />
      </Marker>
    ));
  }
}
