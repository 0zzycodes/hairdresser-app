import React from 'react';

import './footer.scss';
const Footer = ({ handleClick }) => {
  return (
    <footer className="footer">
      <button onClick={handleClick} className="btn">
        Find
      </button>
      {/* <p className="copyright">
        &copy; HairD {new Date().getFullYear()} | Designed by{' '}
        <a href="https://ozzy-dev.netlify.com"> Ozzy-dev</a>
      </p> */}
    </footer>
  );
};

export default Footer;
