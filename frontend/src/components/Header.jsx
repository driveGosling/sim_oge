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

      {/* Табличка и метрики по центру */}
      <div className="stats-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th colSpan="3" className="stats-header-cell">
                <Link to="/profile" className="profile-btn stats-button">
                  <img src={profile} alt="prf" className="profile-icon" />
                  <span className="profile-text">Профиль</span>
                </Link>
              </th>
            </tr>
            <tr>
              <th>Попытки</th>
              <th>Правильно</th>
              <th>Успех </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>0%</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="photo-container">
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
