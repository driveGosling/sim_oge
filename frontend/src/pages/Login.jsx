import { useState } from 'react';
import './Login.css';

const Login = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className="form-login" onSubmit={handleSubmit}>
      <h2>Вход</h2>

      <div className="text-field text-field_floating">
        <input
          id="email"
          className="text-field__input"
          type="email"
          placeholder=" "
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label htmlFor="email" className="text-field__label">Email</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="password"
          className="text-field__input"
          type="password"
          placeholder=" "
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password" className="text-field__label">Пароль</label>
      </div>

      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;