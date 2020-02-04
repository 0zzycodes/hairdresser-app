import React, { Component } from 'react';
import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';
import loader from '../../assets/loader.gif';

import './register.scss';

export default class Register extends Component {
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
        : this.setState({ isLoading: false, errorMessage: 'Wierd' });
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
    const { handleToggleSidebar } = this.props;
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
      </div>
    );
  }
}
