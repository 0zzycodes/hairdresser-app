import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Homepage from './pages/homepage/homepage';
import LoginAndRegister from './pages/login-register/loginAndRegister';
// import { addLocation } from './redux/location/location.actions';
import './App.css';
import Login from './pages/login/login';
import Register from './pages/register/register';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';
import SetupAccount from './pages/setup-account/setup-account';

class App extends React.Component {
  state = {
    isLoading: true
  };
  unSubscribeFromAuth = null;
  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unSubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      }
      setCurrentUser(userAuth);
    });
  }
  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }
  render() {
    const { currentUser } = this.props;
    return (
      <div className="wrapper">
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              currentUser ? (
                <Redirect to="/setup-account" />
              ) : (
                <LoginAndRegister />
              )
            }
          />
          <Route
            exact
            path="/register"
            render={() =>
              currentUser ? <Redirect to="/home" /> : <Register />
            }
          />
          <Route
            exact
            path="/login"
            render={() => (currentUser ? <Redirect to="/home" /> : <Login />)}
          />
          <Route exact path="/setup-account" component={SetupAccount} />
          <Route
            exact
            path="/home"
            render={() =>
              currentUser ? (
                currentUser.verified ? (
                  <Homepage />
                ) : (
                  <Redirect to="/setup-account" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
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
