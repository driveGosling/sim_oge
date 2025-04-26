import { useState } from 'react';
import './Register.css';
import {
  isValidEmailSyntax,
  getEmailSuggestion,
  validatePassword,
  validateUsername,
  validateConfirmPassword
} from '../contexts/Validator.jsx';

const Register = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [errors, setErrors] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: false }));
    setErrors('');
  };

  const handleCheckbox = e => setAgreed(e.target.checked);

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = {
      username: !validateUsername(formValues.username),
      email: !isValidEmailSyntax(formValues.email),
      password: !validatePassword(formValues.password),
      confirmPassword: !validateConfirmPassword(
        formValues.password,
        formValues.confirmPassword
      )
    };

    if (Object.values(newErrors).includes(true)) {
      setFieldErrors(newErrors);
      if (newErrors.username) return setErrors('Введите корректное имя пользователя (только буквы)');
      if (newErrors.email) return setErrors('Введите корректный email');
      if (newErrors.password) return setErrors('Пароль должен быть не менее 6 символов');
      if (newErrors.confirmPassword) return setErrors('Пароли не совпадают');
    }

    const suggestion = getEmailSuggestion(formValues.email);
    if (suggestion) {
      setFieldErrors(prev => ({ ...prev, email: true }));
      return setErrors(`Возможно, вы имели в виду ${suggestion}?`);
    }

    if (!agreed) {
      return setErrors('Необходимо согласиться с условиями');
    }

    setErrors('');
    setFieldErrors({});
    onSubmit({
      username: formValues.username,
      email: formValues.email,
      password: formValues.password
    });
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
          value={formValues.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="reg-username" className="text-field__label">
          Имя пользователя
        </label>
      </div>

      <div className="text-field text-field_floating">
        <input
          id="reg-email"
          name="email"
          className={`text-field__input ${fieldErrors.email ? 'input-error' : ''}`}
          type="email"
          placeholder=" "
          value={formValues.email}
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
          value={formValues.password}
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
          value={formValues.confirmPassword}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirm-password" className="text-field__label">
          Повторить пароль
        </label>
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
          Я ознакомился(-ась) и согласен(-на) с условиями пользовательского соглашения и даю согласие на обработку персональных данных.
        </label>
      </div>

      {errors && <p className="error-message-reg">{errors}</p>}

      <button type="submit" disabled={!agreed}>Зарегистрироваться</button>
    </form>
  );
};

export default Register;