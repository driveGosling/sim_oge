import './Header.css'
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <Link to="/"><img src="./src/assets/logo-placeholder.png" alt="logo" className="logo" /></Link>
      <h1 className="title">Сдам ГИА: РЕШУ ОГЭ</h1>
    </header>
  );
};

export default Header;
