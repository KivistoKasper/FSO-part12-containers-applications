import { useEffect, useState, useRef } from "react";

const LiveChat = () => {
  const [events, setEvents] = useState([]); // Keeps the chat history
  const [popUpEmoji, setPopUpEmoji] = useState(null); // To handle the pop-up emoji (significant moment) state
  const messagesEndRef = useRef(null);;

  // Set up WebSocket to listen for emoji livedata
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:80/ws");

    socket.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prev) => [...prev, newEvent]);
      //console.log(event.data);

      // Show pop-up animation if it's a significant moment
      if (newEvent.type === "significant" && newEvent?.emote) {
        setPopUpEmoji(newEvent.emote);
        setTimeout(() => {
          setPopUpEmoji(null); // Hide the pop-up emoji after animation is complete
        }, 2000); // Duration of the animation
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // this causes the WebSocket error "was interrupted while the page was loading."
    // too complex to try to make the error go away. Not worth it
    return () => {
      socket.close();
    };
  }, []);

  // Auto-scroll to bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div className="app">
      <div className="header">Emote LiveChat</div>
      <div className="chat-box">
        {events.map((event, index) => {
          const emoji = event.emote || "❓"; // Small error handling in case data is harmed
          const time = event.timestamp || event.time || null;
          const formattedTime = time ? new Date(time).toLocaleTimeString() : "";

          return (
            <div className="chat-bubble" key={index}>
              <span className="emoji">{emoji}</span>
              <span className="timestamp">{formattedTime}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Pop-up emoji animation */}
      {popUpEmoji && <div className="pop-up-emoji">{popUpEmoji}</div>}
    </div>
  );
};

export default LiveChat;
