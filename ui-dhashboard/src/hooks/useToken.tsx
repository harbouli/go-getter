import { useState } from "react";

function useToken() {
  const initialToken = localStorage.getItem("access_token") || null;
  const [token, setToken] = useState<string | null>(initialToken);

  function getToken() {
    return token;
  }

  function setAcccesToken(newToken: string) {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
  }

  function removeToken() {
    localStorage.removeItem("access_token");
    setToken(null);
  }

  return { getToken, setAcccesToken, removeToken };
}

export default useToken;
