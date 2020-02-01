import React from 'react';
import { Marker } from 'react-map-gl';
import store from '../../assets/store.svg';

export default class ShopIndicator extends React.Component {
  render() {
    const { data, onClick } = this.props;

    return data.map((shop, index) => (
      <Marker
        key={`marker-${index}`}
        longitude={shop.location.coordinates[0]}
        latitude={shop.location.coordinates[1]}
      >
        <img
          src={store}
          alt="indicatore"
          width="20px"
          height="20px"
          onClick={() => onClick(shop)}
        />
      </Marker>
    ));
  }
}
