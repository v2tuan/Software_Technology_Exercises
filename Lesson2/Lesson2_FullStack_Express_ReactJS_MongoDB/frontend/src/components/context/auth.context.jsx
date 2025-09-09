// src/components/context/auth.context.jsx
import { createContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  auth: { isAuthenticated: false, user: { email: '', name: '' } },
  setAuth: () => {},
  appLoading: true,
  setAppLoading: () => {},
  login: () => {},
  logout: () => {}
});

export const AuthWrapper = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { email: '', name: '' }
  });

  const [appLoading, setAppLoading] = useState(true);

  const login = (user) => setAuth({ isAuthenticated: true, user });
  const logout = () =>
    setAuth({ isAuthenticated: false, user: { email: '', name: '' } });

  const value = useMemo(
    () => ({ auth, setAuth, appLoading, setAppLoading, login, logout }),
    [auth, appLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
