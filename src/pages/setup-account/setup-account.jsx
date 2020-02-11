import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { GenerateId } from '../../utils/OTP';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import loader from '../../assets/loader.gif';
import './setup-account.scss';

class SetupAccount extends Component {
  state = {
    address: '',
    nin: '',
    vin: '',
    phone: '',
    otp: '',
    selectSize: '',
    isNin: false,
    isVin: false,
    isNinVerified: false,
    isVinVerified: false,
    isLoading: false,
    canVerify: false,
    isPhoneVerified: false
  };
  sendOtp = async e => {
    e.preventDefault();
    let response = await fetch(
      'https://hairdresser-app.herokuapp.com/api/v1/send-code',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otp: GenerateId(),
          phone: this.state.phone.substring(1)
        })
      }
    );
    let data = await response.json();
    console.log(data);
    this.setState({ canVerify: true });
  };
  verifyOtp = async e => {
    e.preventDefault();
    let response = await fetch(
      'https://hairdresser-app.herokuapp.com/api/v1/verify-code',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otp: this.state.otp
        })
      }
    );
    let data = await response.json();
    console.log(data);
    if (data.status === 'Success') {
      this.setState({ isPhoneVerified: true });
    }
  };
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value, isSuccess: false });
  };
  handleComplete = async e => {
    e.preventDefault();
    const { currentUser } = this.props;
    const { address, nin, vin, phone } = this.state;
    this.setState({ isLoading: true });
    const { displayName, email, joined } = currentUser;

    const userRef = firestore
      .collection('users')
      .where('id', '==', currentUser.id);

    userRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        firestore
          .collection('users')
          .doc(doc.id)
          .update({
            displayName,
            email,
            joined,
            address,
            nin,
            vin,
            phone,
            verified: true
          });
      });
    });
  };
  render() {
    return (
      <div className="setup-account">
        <div className="head">
          <h4>Complete Registration</h4>
        </div>
        <div className="contents">
          <form>
            <input
              type="text"
              name="address"
              required
              value={this.state.address}
              placeholder="Address"
              className="form-input"
              onChange={this.handleChange}
            />
            <div className="box">
              <select
                name="selectSize"
                value={this.state.selectSize}
                onChange={this.handleChange}
              >
                <option value="vin/nin">-- VIN / NIN --</option>
                <option value="vin">VIN</option>
                <option value="nin">NIN</option>
              </select>
              <span className="indc">&#9662;</span>
              {/* <span className="indc">&#9662;</span> */}
            </div>
            {this.state.selectSize === 'nin' ? (
              <div className="group">
                <input
                  type="number"
                  name="nin"
                  required
                  value={this.state.nin}
                  placeholder="Enter NIN"
                  className="form-input"
                  onChange={this.handleChange}
                />
                <button
                  className="btn"
                  style={
                    this.state.isNinVerified ? { background: 'green' } : {}
                  }
                  //  onClick={this.handleComplete}
                >
                  Verify{' '}
                  {this.state.isLoading ? (
                    <img src={loader} alt="Loader" />
                  ) : null}
                </button>
              </div>
            ) : null}
            {this.state.selectSize === 'vin' ? (
              <div className="group">
                <input
                  type="number"
                  name="vin"
                  required
                  value={this.state.vin}
                  placeholder="Enter VIN"
                  className="form-input"
                  onChange={this.handleChange}
                />
                <button
                  className="btn"
                  style={
                    this.state.isVinVerified ? { background: 'green' } : {}
                  }
                  //  onClick={this.handleComplete}
                >
                  Verify{' '}
                  {this.state.isLoading ? (
                    <img src={loader} alt="Loader" />
                  ) : null}
                </button>
              </div>
            ) : null}
            <div className="group">
              <input
                type="number"
                name="phone"
                required
                value={this.state.phone}
                placeholder="Enter phone number"
                className="form-input"
                onChange={this.handleChange}
              />
              <button
                className="btn"
                onClick={this.sendOtp}
                style={
                  this.state.isPhoneVerified ? { background: 'green' } : {}
                }
              >
                Verify{' '}
                {this.state.isLoading ? (
                  <img src={loader} alt="Loader" />
                ) : null}
              </button>
            </div>
            {this.state.canVerify ? (
              <div className="group">
                <input
                  type="number"
                  name="otp"
                  required
                  value={this.state.otp}
                  placeholder="Enter otp"
                  className="form-input"
                  onChange={this.handleChange}
                />
                <button
                  className="btn"
                  onClick={this.verifyOtp}
                  style={
                    this.state.isPhoneVerified ? { background: 'green' } : {}
                  }
                >
                  Verify{' '}
                  {this.state.isLoading ? (
                    <img src={loader} alt="Loader" />
                  ) : null}
                </button>
              </div>
            ) : null}
          </form>
          {this.state.nin !== '' ? (
            this.state.phone !== '' ? (
              this.state.isPhoneVerified ? (
                <button className="btn complete" onClick={this.handleComplete}>
                  COMPLETED{' '}
                  {this.state.isLoading ? (
                    <img src={loader} alt="Loader" />
                  ) : null}
                </button>
              ) : null
            ) : null
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});
export default connect(mapStateToProps)(SetupAccount);
