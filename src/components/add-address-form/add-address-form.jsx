import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { setUserAddress } from '../../redux/user-info/user-info.actions';
import {
  addShippingDetails,
  addCity
} from '../../redux/shipping/shipping.actions';
import input from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import './add-address-form.scss';

class AddAddressForm extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      companyName: '',
      address: '',
      city: '',
      country: '',
      region: '',
      zipCode: '',
      phone: '',
      email: '',
      isShow: false
    };
  }
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  selectCountry(val) {
    this.setState({ country: val });
  }

  selectRegion(val) {
    this.setState({ region: val });
  }
  handleSubmit = async e => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      address,
      city,
      country,
      region,
      zipCode,
      phone,
      email
    } = this.state;

    const billing = {
      firstName,
      lastName,
      address,
      city,
      country,
      region,
      zipCode,
      phone,
      email
    };
    this.props.addShippingDetails(billing);
    this.props.setUserAddress(billing);
    this.props.addCity(city);
    this.props.handleToggleShow();
  };
  render() {
    const {
      firstName,
      lastName,
      address,
      city,
      country,
      region,
      zipCode,
      phone,
      email
    } = this.state;

    return (
      <div className="add-shipping-form">
        <form onSubmit={this.handleSubmit}>
          <input
            required
            type="text"
            name="firstName"
            value={firstName}
            placeholder="First Name"
            className="form-input"
            onChange={this.handleChange}
          />
          <input
            required
            type="text"
            name="lastName"
            value={lastName}
            placeholder="Last Name"
            className="form-input"
            onChange={this.handleChange}
          />
          <input
            required
            type="text"
            name="address"
            value={address}
            placeholder="Address"
            className="form-input"
            onChange={this.handleChange}
          />
          <CountryDropdown
            className="country-drop"
            value={country}
            onChange={val => this.selectCountry(val)}
          />
          <RegionDropdown
            className="region-drop"
            country={country}
            value={region}
            onChange={val => this.selectRegion(val)}
          />
          <input
            required
            type="text"
            name="city"
            value={city}
            placeholder="City"
            className="form-input"
            onChange={this.handleChange}
          />
          <input
            required
            type="text"
            name="zipCode"
            value={zipCode}
            placeholder="ZIP Code"
            className="form-input"
            onChange={this.handleChange}
          />
          <input
            required
            type="phone"
            name="phone"
            value={phone}
            placeholder="Phone"
            className="form-input"
            onChange={this.handleChange}
          />
          <input
            required
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            className="form-input"
            onChange={this.handleChange}
          />
          <CustomButton type="submit">Add Address</CustomButton>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addShippingDetails: details => dispatch(addShippingDetails(details)),
  setUserAddress: details => dispatch(setUserAddress(details)),
  addCity: details => dispatch(addCity(details))
});

export default withRouter(connect(null, mapDispatchToProps)(AddAddressForm));
