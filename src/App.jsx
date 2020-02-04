import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Homepage from './pages/homepage/homepage';
import LoginAndRegister from './pages/login-register/loginAndRegister';
// import { addLocation } from './redux/location/location.actions';
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';
import './App.css';
import Login from './components/login/login';
import Register from './components/register/register';

class App extends React.Component {
  state = {
    isLoading: true
  };
  componentDidMount() {}

  render() {
    const { currentUser } = this.props;
    return (
      <div className="wrapper">
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              currentUser ? <Redirect to="/home" /> : <LoginAndRegister />
            }
          />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Homepage} />
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});
const mapDispatchToProps = dispatch => ({
  // addLocation: location => dispatch(addLocation(location)),
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
