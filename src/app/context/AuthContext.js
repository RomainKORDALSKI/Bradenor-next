import React, { createContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const SECRET_KEY = 'your_secret_key';

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 1000 * 60); // Vérifie toutes les minutes

    return () => clearInterval(interval);
  }, [router]);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };


