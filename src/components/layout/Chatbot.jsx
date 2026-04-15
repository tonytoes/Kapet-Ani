import { useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";
import "../../styles/Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setOpen(!open);
  };

  return (
    <>
      <div
        className={`chatbot ${!open ? "float" : ""}`}
        onClick={toggleChat}
      >
        <BsChatDotsFill />
      </div>
      {open && (
        <div className="chatbot-window">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/NF6tILzKLRgARlEfD_1sZ"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      )}
    </>
  );
}

export default Chatbot;