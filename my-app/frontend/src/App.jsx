import { Routes, Route } from "react-router-dom";
import { createContext, useState, useContext } from "react";
import "./App.css";

import Header from "./components/Header";
import Contact from "./components/Contact";
import LiveChat from "./components/LiveChat";
import Login from "./components/Login";
import Settings from "./components/Settings";
import Notification from "./components/Notification";

// Create a context to handle notifications across the app
const NotificationContext = createContext();

// Custom hook to use notification context
export const useNotification = () => useContext(NotificationContext);

function App() {
  const [notification, setNotification] = useState({ message: "", status: "" }); // State for notification messages
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in

  // Function to show notification and auto-clear after 5 seconds
  const showNotification = (message, status) => {
    setNotification({ message, status });
    setTimeout(() => {
      setNotification({ message: "", status: "" });
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div className="container">
        {/* Notification banner */}
        <Notification message={notification.message} status={notification.status} />
        <Routes>
          <Route path="/" element={<LiveChat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </NotificationContext.Provider>
  );
}

export default App;
