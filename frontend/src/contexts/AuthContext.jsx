import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/profile")
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const register = async ({ username, email, password }) => {
    const { data } = await API.post("/auth/register", { username, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const login = async ({ email, password }) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

