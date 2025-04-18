import React from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom';
import VariantConstructor from '../components/VariantConstructor';

// Логику не понял, исправить если надо, то исправим
const Main = ({ variantsList }) => (
  <main className="main">
    <section className="section-tren">
      <h2>Тренировочные варианты</h2>
      <ul className="variants-list">
        <span className="corner-bl" />
        <span className="corner-br" />
        {Array.from({ length: 20 }, (_, idx) => (
          <li className="li-test" key={idx + 1}>
            <Link to={`/test/${idx + 1}`}>{`Вариант ${idx + 1}`}</Link>
          </li>
        ))}
      </ul>
    </section>

      <h2>Конструктор вариантов</h2>
    <div className="descr-wrapper">
      <span className="corner-bl" />
      <span className="corner-br" />
      <p className="descr">
        Чтобы целенаправленно тренироваться по определённым темам, вы можете составить вариант из
        необходимого количества заданий по конкретным разделам каталога.
      </p>
    </div>
    <VariantConstructor />
  </main>
);

export default Main;