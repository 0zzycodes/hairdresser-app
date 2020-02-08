import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { setCurrentUser } from '../../redux/user/user.actions';
import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import FormInput from '../../components/form-input/form-input';
import CustomButton from '../../components/custom-button/custom-button';
import loader from '../../assets/loader.gif';
import left from '../../assets/left.svg';

import './register.scss';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isLoading: false
    };
  }
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errorMessage: '' });
  };
  handleSubmit = async e => {
    e.preventDefault();
    const { displayName, email, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({
        errorMessage: `Password did not match!`
      });
      return;
    }
    try {
      this.setState({ isLoading: true });
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await createUserProfileDocument(user, { displayName });
      this.setState({ isSuccess: true });
    } catch (error) {
      error.code === 'auth/email-already-in-use'
        ? this.setState({
            isLoading: false,
            errorMessage:
              'The email address is already in use by another account'
          })
        : error.code === 'auth/weak-password'
        ? this.setState({
            isLoading: false,
            errorMessage: 'Password should be at least 6 characters'
          })
        : this.setState({
            isLoading: false,
            errorMessage: 'Shit just got real'
          });
    }
    this.setState({
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };
  render() {
    const {
      displayName,
      email,
      password,
      confirmPassword,
      errorMessage,
      isLoading
    } = this.state;
    return (
      <div className="register">
        <div>
          <h3 className="title">REGISTER</h3>
          {errorMessage !== '' ? (
            <span className="error">{errorMessage}</span>
          ) : null}
          <form onSubmit={this.handleSubmit}>
            <FormInput
              type="text"
              name="displayName"
              value={displayName}
              label="Name"
              onChange={this.handleChange}
            />
            <FormInput
              type="email"
              name="email"
              value={email}
              label="Email"
              onChange={this.handleChange}
            />
            <FormInput
              type="password"
              name="password"
              value={password}
              label="Password"
              onChange={this.handleChange}
            />
            <FormInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              label="Confirm password"
              onChange={this.handleChange}
            />
            <div className="buttons">
              <CustomButton type="submit">
                Register {isLoading ? <img src={loader} alt="Loader" /> : null}
              </CustomButton>
            </div>
          </form>
        </div>
        <div className="home">
          <Link to="/">
            <img src={left} alt="Back Icon" />
          </Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default withRouter(connect(null, mapDispatchToProps)(Register));
