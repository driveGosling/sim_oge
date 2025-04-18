import './Footer.css';
import logoSrc from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo-container">
        <img src={logoSrc} alt="Логотип" className="footer-logo" />
      </div>
      <div className="footer-column project-column">
        <h3 className="footer-title">О проекте</h3>
        <p className="footer-text">
          Этот проект создан для подготовки к ОГЭ по истории России. Здесь вы найдёте конспекты,
          тесты и примеры заданий, которые помогут эффективно подготовиться к экзамену.
        </p>
      </div>
      <div className="footer-column dev-column">
        <h3 className="footer-title">Разработка</h3>
        <ul className="footer-list">
          <li><a href="https://github.com/KudesnikRaph" target="_blank" rel="noopener noreferrer">Даниил К.</a></li>
          <li><a href="https://github.com/driveGosling" target="_blank" rel="noopener noreferrer">Иоан П.</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3 className="footer-title">Источники</h3>
        <ul className="footer-list">
          <li><a href="https://narfu.ru/" target="_blank" rel="noopener noreferrer">Официальный сайт НарФУ</a></li>
          <li><a href="https://istockphoto.com/" target="_blank" rel="noopener noreferrer">iStockPhoto</a></li>
          <li><a href="https://rosbalt.ru/" target="_blank" rel="noopener noreferrer">Росбалт</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;