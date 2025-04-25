// src/pages/Register.jsx
import { useState } from 'react';
import './Register.css';

export default function Register({ onSubmit }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Здесь можно выполнить валидацию, а затем:
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Логин"
        required
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Пароль"
        required
      />
      <input
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Повтор пароля"
        required
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
