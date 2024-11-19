import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
// step 1 : context 만들기
export const AuthenticationContext = createContext(null);

function AuthenticationProvider({ children }) {
  const [id, setId] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setId(decoded.sub);
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setId(decoded.sub);
  }

  function logout() {
    localStorage.removeItem("token");
    setId("");
  }

  return (
    <AuthenticationContext.Provider value={{ id, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationProvider;
