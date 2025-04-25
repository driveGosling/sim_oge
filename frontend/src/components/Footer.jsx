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
          <li><a href="https://uchitel.pro/история-россии-предмет" target="_blank" rel="noopener noreferrer">Учитель</a></li>
          <li><a href="https://www.universalinternetlibrary.ru/book/46892/ogl.shtml?ysclid=m9mus68489801928238/" target="_blank" rel="noopener noreferrer">Электронная библиотека</a></li>
          <li><a href="https://www.rusempire.ru/istoriya-rossii-kratko.html/" target="_blank" rel="noopener noreferrer">История государства россиит</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;