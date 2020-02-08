import React from 'react';
import { auth } from '../../firebase/firebase.utils';
import logout from '../../assets/logout.svg';
import './side-nav.scss';
const SideNav = () => {
  return (
    <div className="side-nav">
      <h3>Sidebar</h3>
      <div className="user" onClick={() => auth.signOut()}>
        <img src={logout} alt="Logout-Button" />
      </div>
    </div>
  );
};

export default SideNav;
