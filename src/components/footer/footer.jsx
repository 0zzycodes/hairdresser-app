import React from 'react';

import './footer.scss';
const Footer = () => {
  return (
    <footer className="footer">
      <p className="copyright">
        &copy; HairD {new Date().getFullYear()} | Designed by{' '}
        <a href="https://ozzy-dev.netlify.com"> Ozzy-dev</a>
      </p>
    </footer>
  );
};

export default Footer;
