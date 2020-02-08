import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import loader from '../../assets/loader.gif';
import './setup-account.scss';

class SetupAccount extends Component {
  state = {
    address: '',
    nin: '',
    vin: '',
    phone: '',
    selectSize: '',
    isNin: false,
    isVin: false,
    isLoading: false
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value, isSuccess: false });
  };
  handleSubmit = async e => {
    e.preventDefault();
    const { currentUser } = this.props;
    const { address, nin, vin, phone } = this.state;
    this.setState({ isLoading: true });
    const userRef = firestore.doc(`users/${currentUser.id}`);
    const snapShot = await userRef.get();
    if (snapShot.exists) {
      const { displayName, email, joined } = currentUser;
      try {
        if (address & nin & vin & phone) {
          await userRef.set({
            displayName,
            email,
            joined,
            address,
            nin,
            vin,
            phone,
            verified: true
          });
        }
        this.setState({ isLoading: false });
      } catch (error) {
        this.setState({ isLoading: false });
        console.log('Error Updating user');
      }
    }
  };
  render() {
    return (
      <div className="setup-account">
        <div className="head">
          <h3>Complete Registration</h3>
        </div>
        <div className="contents">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="address"
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
                <option value="vin/nin">VIN / NIN</option>
                <option value="vin">VIN</option>
                <option value="nin">NIN</option>
              </select>
              {/* <span className="indc">&#9662;</span> */}
            </div>
            {this.state.selectSize === 'nin' ? (
              <div className="group">
                <input
                  type="number"
                  name="nin"
                  value={this.state.nin}
                  placeholder="Enter NIN"
                  className="form-input"
                  onChange={this.handleChange}
                />
                <button
                  className="btn"
                  //  onClick={this.handleSubmit}
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
                  value={this.state.vin}
                  placeholder="Enter VIN"
                  className="form-input"
                  onChange={this.handleChange}
                />
                <button
                  className="btn"
                  //  onClick={this.handleSubmit}
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
                value={this.state.phone}
                placeholder="Enter phone number"
                className="form-input"
                onChange={this.handleChange}
              />
              <button
                className="btn"
                //  onClick={this.handleSubmit}
              >
                Verify{' '}
                {this.state.isLoading ? (
                  <img src={loader} alt="Loader" />
                ) : null}
              </button>
            </div>
          </form>
          <button className="btn" onClick={this.handleSubmit}>
            COMPLETED{' '}
            {this.state.isLoading ? <img src={loader} alt="Loader" /> : null}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});
export default connect(mapStateToProps)(SetupAccount);
