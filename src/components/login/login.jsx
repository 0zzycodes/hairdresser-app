import React, { Component } from 'react';
import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';
import loader from '../../assets/loader.gif';

import './login.scss';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  }
  handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = this.state;

    try {
      this.setState({ isLoading: true });
      this.setState({ email: '', password: '' });
    } catch (error) {
      error.code === 'auth/wrong-password'
        ? this.setState({
            isLoading: false,
            errorMessage:
              'The password is invalid or the user does not have a password.'
          })
        : error.code === 'auth/user-not-found'
        ? this.setState({
            isLoading: false,
            errorMessage:
              'There is no user record corresponding to this identifier.'
          })
        : this.setState({ isLoading: false, errorMessage: 'Wierd' });
    }
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errorMessage: ''
    });
  };
  render() {
    const { email, password, errorMessage, isLoading } = this.state;
    return (
      <div className="login">
        <div>
          <h3 className="title">LOGIN</h3>
          {errorMessage !== '' ? (
            <span className="error">{errorMessage}</span>
          ) : null}
          <form onSubmit={this.handleSubmit}>
            <FormInput
              type="email"
              name="email"
              value={email}
              required
              handleChange={this.handleChange}
              label="Email"
            />
            <FormInput
              type="password"
              name="password"
              value={password}
              required
              handleChange={this.handleChange}
              label="Password"
            />
            <div className="buttons">
              <CustomButton type="button">
                Login {isLoading ? <img src={loader} alt="Loader" /> : null}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
