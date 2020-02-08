import React from 'react';
import { withRouter } from 'react-router-dom';
import { auth } from '../../firebase/firebase.utils';
import logout from '../../assets/logout.svg';
import './side-nav.scss';
const SideNav = ({ history }) => {
  const logUserOut = async () => {
    await auth.signOut();
    window.location.reload();
    history.push('/login');
  };
  return (
    <div className="side-nav">
      <h3>Sidebar</h3>
      <div className="user" onClick={logUserOut}>
        <img src={logout} alt="Logout-Button" />
      </div>
    </div>
  );
};

export default withRouter(SideNav);
