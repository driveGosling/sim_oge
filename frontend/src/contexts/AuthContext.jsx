import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "/api" });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    attempts: 0,
    correct: 0,
    successRate: 0,
    history: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/profile")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const res = await API.get("/attempts");
      const attemptsData = res.data;
      const totalAttempts = attemptsData.length;
      const correctAttempts = attemptsData.filter((a) => a.successful).length;
      const successRate =
        totalAttempts > 0
          ? Math.round((correctAttempts / totalAttempts) * 100)
          : 0;
      const history = attemptsData.map((a) => ({
        date: new Date(a.created_at).toLocaleDateString(),
        variantId: a.variant_id,
        result: a.successful ? "Правильно" : "Неправильно",
        correctAnswersCount: a.correct_questions,
        incorrectAnswersCount: a.total_questions - a.correct_questions,
        totalQuestions: a.total_questions,
      }));
      setStats({
        attempts: totalAttempts,
        correct: correctAttempts,
        successRate,
        history,
      });
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const register = async ({ username, email, password }) => {
    const { data } = await API.post("/auth/register", {
      username,
      email,
      password,
    });
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
    <AuthContext.Provider
      value={{ user, stats, fetchStats, register, login, logout, API }}
    >
      {children}
    </AuthContext.Provider>
  );
};
