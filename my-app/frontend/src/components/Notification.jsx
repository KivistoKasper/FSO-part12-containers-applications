const Notification = ({ message, status }) => {
    if (!message) return null;
    //Show notification only if there is a message
    return (
      <div className={`notification ${status}`}>
        {message}
      </div>
    );
  };
  
  export default Notification;
  