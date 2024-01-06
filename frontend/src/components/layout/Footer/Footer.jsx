import React, { createElement } from 'react';
import './Footer.scss';

const Footer = () => {
  const handleBackToTop = () => {
    const a = document.createElement('a');
    a.setAttribute('href', '#nav');
    a.click();
  };

  return (
    <footer className='footer'>
      <div className='backToTop' onClick={handleBackToTop}>
        <h3>Back to top</h3>
      </div>
      <div className='footer_wrapper'>
        <div className='leftFooter'>
          <h4>DOWNLOAD OUR APP</h4>
          <p>Download App for Android and IOS mobile phones</p>
          <img
            src='https://img.freepik.com/premium-vector/google-play-icons-set_578229-241.jpg?w=826'
            alt=' download-link'
          />
          <img
            src='https://img.freepik.com/premium-vector/google-play-icons-set_578229-241.jpg?w=826'
            alt=' download-link1'
          />
        </div>
        <div className='midFooter'>
          <h4>ECOMMERCE</h4>
          <p>High Quality is our first priority</p>
          <p>Copyrights {new Date().getFullYear()} &copy; Me Santosh Kumar</p>
        </div>
        <div className='rightFooter'>
          <h4>Follow Us</h4>
          <a href='http://instagram.com/mesantoshsah'>Instagram</a>
          <a href='http://instagram.com/mesantoshsah'>Youtube</a>
          <a href='http://instagram.com/mesantoshsah'>Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
