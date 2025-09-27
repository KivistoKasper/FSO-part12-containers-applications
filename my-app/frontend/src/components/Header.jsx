import { NavLink, useNavigate} from "react-router-dom";
import LoginService from "../services/login";
import { useNotification } from "../App";

const Header = ({loggedIn, setLoggedIn}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogout = () => {
    LoginService.logout();
    setLoggedIn(false);
    showNotification("Log out successful!", "success");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Live chat
          </NavLink>
        </li>
      </ul>

      {/*Render conditionally based on if user is logged in*/}
      <ul>
        {!loggedIn && (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Log in
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact
          </NavLink>
        </li>
        {loggedIn && (
          <>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Settings
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
