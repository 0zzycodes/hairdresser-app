import React from 'react';

export default class ShopInfo extends React.Component {
  render() {
    const { info } = this.props;
    const displayName = `${info.shopId}`;

    return (
      <div>
        <div>{displayName}</div>
      </div>
    );
  }
}
