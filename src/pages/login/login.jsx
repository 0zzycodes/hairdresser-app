import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setCurrentUser } from '../../redux/user/user.actions';
import FormInput from '../../components/form-input/form-input';
import CustomButton from '../../components/custom-button/custom-button';
import loader from '../../assets/loader.gif';

import './login.scss';
class Login extends Component {
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
      let response = await fetch(
        'https://hairdresser-app.herokuapp.com/api/v1/users/login',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );
      let data = await response.json();
      this.setState({ isLoading: false });
      this.props.setCurrentUser(data.data.user);
      this.setState({ email: '', password: '' });
      this.props.history.push(`/home`);
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
              <CustomButton type="button" onClick={this.handleSubmit}>
                Login {isLoading ? <img src={loader} alt="Loader" /> : null}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default withRouter(connect(null, mapDispatchToProps)(Login));
