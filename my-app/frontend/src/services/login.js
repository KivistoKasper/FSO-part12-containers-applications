import axios from "axios";

/*
The vite.config.js file should change the address of the requests to "localhost:3000".
If it doesn't work change it manually here
*/

const login = async (credentials) => {
  const response = await axios.post("http://localhost:3001/login", credentials);
  const token = response.data.token;
  if (token) {
    window.localStorage.setItem("userToken", token);
  }
  return token;
};

const logout = () => {
  window.localStorage.removeItem("userToken");
};

const getToken = () => {
  return window.localStorage.getItem("userToken");
};

export default { login, logout, getToken };
