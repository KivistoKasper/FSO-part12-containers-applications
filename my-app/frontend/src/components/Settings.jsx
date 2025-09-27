import { useEffect, useState } from "react";
import {
  fetchSettingsData,
  updateIntervalSetting,
  updateThresholdSetting,
  updateAllowedEmotes,
} from "../services/settings";
import { useNotification } from "../App";

const Settings = () => {
  // State to hold the interval, threshold, and allowed emotes
  const [interval, setInterval] = useState(""); 
  const [threshold, setThreshold] = useState(""); 
  const [emotes, setEmotes] = useState([]);  
  const [loading, setLoading] = useState(true);  // To track if settings are still being fetched

  const { showNotification } = useNotification();  
  const api = "http://localhost:3001/settings";  // API endpoint for settings

  // All possible emotes, future dev this could be function in the backend returning all possible emotes
  const allPossibleEmotes = ["❤️", "👍", "😢", "😡"];

  // Fetch the current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await fetchSettingsData(api);

        // Set the state based on the fetched settings
        setInterval(settings.interval);
        setThreshold(settings.threshold);

        // Map all possible emotes and mark if allowed
        const allowedEmotesSet = new Set(settings.emotes.map(e => e.emote));
        const allEmotes = allPossibleEmotes.map(emote => ({
          emote,
          isAllowed: allowedEmotesSet.has(emote),
        }));

        setEmotes(allEmotes);
        setLoading(false);  // Stop showing loading when data is fetched
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };

    fetchSettings();
  }, []);  // Empty dependency array, so this runs only once when the component mounts

  // Update the interval setting
  const updateInterval = async () => {
    try {
      await updateIntervalSetting(api, interval); 
      showNotification("Interval updated successfully", "success");
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Error updating interval", "error");
    }
  };

  // Update the threshold setting
  const updateThreshold = async () => {
    try {
      await updateThresholdSetting(api, threshold);  
      showNotification("Threshold updated successfully", "success");
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Error updating threshold", "error");
    }
  };

  const toggleEmote = (index) => {
    const updated = [...emotes];
    updated[index].isAllowed = !updated[index].isAllowed;  // Toggle the allowed status
    setEmotes(updated);  // Update the state with the new emote list
  };

  // Update the allowed emotes setting
  const updateEmotes = async () => {
    try {
      await updateAllowedEmotes(api, emotes);  
      showNotification("Allowed emotes updated", "success");
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Error updating emotes", "error");
    }
  };

  return (
    <div className="settings">
      <h3>Settings Panel</h3>

      {loading ? (
        // Show loading message until settings are fetched
        <p>Loading settings...</p>
      ) : (
        <>
          <div className="setting-group">
            <label>Interval (messages before analysis):</label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}  
            />
            <button onClick={updateInterval}>Update Interval</button>  {/* Button to trigger interval update */}
          </div>

          <div className="setting-group">
            <label>Threshold (fraction to mark as significant):</label>
            <input
              type="number"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)} 
            />
            <button onClick={updateThreshold}>Update Threshold</button>  {/* Button to trigger threshold update */}
          </div>

          <div className="setting-group">
            <label>Allowed Emotes:</label>
            <ul className="emote-list">
              {emotes.map((emote, idx) => (
                <li key={idx}>
                  <span style={{ fontSize: "1.5rem" }}>{emote.emote}</span>
                  <input
                    type="checkbox"
                    checked={emote.isAllowed}
                    onChange={() => toggleEmote(idx)} 
                  />
                </li>
              ))}
            </ul>
            <button onClick={updateEmotes}>Update Emotes</button>  {/* Button to trigger emote update */}
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
