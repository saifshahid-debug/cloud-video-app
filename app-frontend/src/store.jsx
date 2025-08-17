import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const Ctx = createContext();

export function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Since backend is not ready, always start logged out
  setUser(null);
  setLoading(false);
}, []);



  const login = async (email, password) => {
    const { user } = await api.login({ email, password });
    setUser(user);
  };

  const signup = async (payload) => {
    const { user } = await api.signup(payload);
    setUser(user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => useContext(Ctx);
