import './Header.css';
import { Link } from 'react-router-dom';
import logoSrc from '../assets/logo.png';
import peterSrc from '../assets/peter.png';
import bookSrc from '../assets/book.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={logoSrc} alt="logo" className="logo" />
        </Link>
        <h2 className="subtitle">История россии</h2>
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
    </header>
  );
};

export default Header;
