import { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logoSrc from '../assets/logo.png';
import peterSrc from '../assets/peter.png';
import bookSrc from '../assets/book.png';
import profile from '../assets/OrangeProfile.png';
import Profile from './Profile.jsx';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={logoSrc} alt="logo" className="logo" />
        </Link>
        <h2 className="subtitle">История россии</h2>
      </div>

      <div className='profile-container'>
        <Link to="/profile" className="profile-link">
          <span className="profile-text">Профиль</span>
          <img src={profile} alt="prf" className='profile-icon' />
        </Link>
      </div>
      
      <div
        className="photo-container"
      >
        <img src={bookSrc} alt="Книги" className="books" />
        <img
          src={peterSrc}
          alt="Пётр Первый"
          className="photo"
        />
      </div>
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </header>
  );
};

export default Header;
