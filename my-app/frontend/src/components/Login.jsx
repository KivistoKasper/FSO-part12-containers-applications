import { useState } from "react";
import LoginService from "../services/login";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../App";

const Login = ({setLoggedIn}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      //lähetetään login pyyntö, tyhjennetään lomake, näytetään ilmotus ja navigoidaan livechattiin
      await LoginService.login({ username, password });
      setUsername("");
      setPassword("");
      showNotification("Login successful!", "success");
      setLoggedIn(true);
      navigate("/");
    } catch (e) {
      console.error("Login error:", e);
      showNotification("Invalid username or password", "error");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>Log in</h3>
      <label>
        Username:
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          data-testid="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;
