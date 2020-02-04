import React from 'react';
import { Link } from 'react-router-dom';
import hair from '../../assets/hair.png';
import './loginAndRegister.scss';
import CustomButton from '../../components/custom-button/custom-button';
const LoginAndRegister = () => {
  return (
    <div className="login-register">
      <div className="wrap">
        <div className="brand">
          <img src={hair} alt="Logo" className="logo" />
          <h4 className="branding-txt">HairD</h4>
        </div>
        <div className="buttons">
          <Link to="/login">
            <CustomButton>Login</CustomButton>
          </Link>
          <Link to="/register">
            <CustomButton>Register</CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;
