import { useState } from 'react';
import './Register.css';

const Register = ({ onSubmit, fieldErrors = {}, errors = '' }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    onSubmit({ username, email, password });
  };

  const handleCheckbox = e => setAgreed(e.target.checked);
  const handleChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'username': setUsername(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
      default: break;
    }
  };

  return (
    <form className="form-register" onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <div className="text-field text-field_floating">
        <input
          id="reg-username"
          name="username"
          className={`text-field__input ${fieldErrors.username ? 'input-error' : ''}`}
          type="text"
          placeholder=" "
          value={username}
          onChange={handleChange}
          required
        />
        <label htmlFor="reg-username" className="text-field__label">Имя пользователя</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="reg-email"
          name="email"
          className={`text-field__input ${fieldErrors.email ? 'input-error' : ''}`}
          type="email"
          placeholder=" "
          value={email}
          onChange={handleChange}
          required
        />
        <label htmlFor="reg-email" className="text-field__label">Email</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="reg-password"
          name="password"
          className={`text-field__input ${fieldErrors.password ? 'input-error' : ''}`}
          type="password"
          placeholder=" "
          value={password}
          onChange={handleChange}
          required
        />
        <label htmlFor="reg-password" className="text-field__label">Пароль</label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="confirm-password"
          name="confirmPassword"
          className={`text-field__input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
          type="password"
          placeholder=" "
          value={confirmPassword}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirm-password" className="text-field__label">Повторить пароль</label>
      </div>

      <div className="terms">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={agreed}
          onChange={handleCheckbox}
          required
        />
        <label htmlFor="terms" className="terms-label">
         <p> Я ознакомился(-ась) и согласен(-на) с условиями Пользовательского соглашения и даю согласие на обработку персональных данных.</p>
        </label>
      </div>

      {errors && <p className="error-message-reg">{errors}</p>}

      <button type="submit" disabled={!agreed}>Зарегистрироваться</button>
    </form>
  );
};

export default Register;