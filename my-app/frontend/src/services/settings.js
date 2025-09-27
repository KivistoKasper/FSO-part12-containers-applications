import loginService from "./login"; 

// Fetches the list of allowed emotes from the server
export const fetchAllowedEmotes = async () => {
  const token = loginService.getToken(); // Get authentication token
  const res = await fetch("/allowed-emotes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch allowed emotes"); // Throw error if fetch fails
  const data = await res.json();
  return data.map((item) => item.emote); // Extract only the emote strings
};

// Fetches all settings data (interval, threshold, allowed emotes) in parallel
export const fetchSettingsData = async (api) => {
  const token = loginService.getToken();
  // Fetch all three settings in parallel
  const [intRes, thrRes, emoRes] = await Promise.all([
    fetch(`${api}/interval`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${api}/threshold`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${api}/allowed-emotes`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  // Parse responses
  const intervalData = await intRes.json();
  const thresholdData = await thrRes.json();
  const emotesData = await emoRes.json();

  // Return all settings in a structured format
  return {
    interval: intervalData.interval,
    threshold: thresholdData.threshold,
    emotes: emotesData.map((e) => ({
      emote: e.emote,
      isAllowed: true,
    })),
  };
};

// Updates the interval setting on the server
export const updateIntervalSetting = async (api, interval) => {
  const token = loginService.getToken();
  const res = await fetch(`${api}/interval`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ interval: parseInt(interval) }), // Ensure interval is an integer
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update interval"); // Throw detailed error if available
  return data;
};

// Updates the threshold setting on the server
export const updateThresholdSetting = async (api, threshold) => {
  const token = loginService.getToken();
  const res = await fetch(`${api}/threshold`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ threshold: parseInt(threshold) }), // Ensure threshold is an integer
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update threshold");
  return data;
};

// Updates the list of allowed emotes on the server
export const updateAllowedEmotes = async (api, emotes) => {
  const token = loginService.getToken();
  const res = await fetch(`${api}/allowed-emotes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(emotes), // Send updated emotes array
  });
  const data = await res.json();
  console.log("data", data)
  if (!res.ok) throw new Error(data.error || "Failed to update emotes");
  return data;
};
