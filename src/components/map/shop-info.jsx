import React from 'react';

export default class CityInfo extends React.Component {
  render() {
    const { info } = this.props;
    const displayName = `${info.city}, ${info.state}`;

    return (
      <div>
        <div>{displayName}</div>
      </div>
    );
  }
}
