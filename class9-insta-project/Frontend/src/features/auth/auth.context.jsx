import { createContext, useState, useEffect } from "react";
import { login, register, getMe } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const res = await login(username, password);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await register(username, email, password);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        handleLogin,
        handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
