import "./AIChat.css";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import ChatGPTsvg from "./chatgpt-icon-svg.svg";

const AIChat = () => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  const handleQuerySubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setConversation((prevData) => [
      ...prevData,
      {
        type: "query",
        text: prompt,
      },
    ]);
    const temp = prompt;
    setPrompt("");
    getResponseFromServer(temp);
  };

  const getResponseFromServer = async (temp) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: temp }),
      });
      const responseData = await response.json();
      setConversation((prevData) => [
        ...prevData,
        {
          type: "response",
          text: responseData.res,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setConversation((prevData) => [
        ...prevData,
        {
          type: "response",
          text: "Something Went Wrong!",
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="ai-conatainer">
      <div className="app-container">
        <h1>Hello, {storedUser.firstname}</h1>
        <div className="conversation-container">
          {conversation.length === 0 ? (
            <div className="conversation-reponse query-container">
              <img src={ChatGPTsvg} alt="" />
              <p>Ask Me Anything ....</p>
            </div>
          ) : (
            <></>
          )}
          {conversation.map((obj, index) =>
            obj.type === "query" ? (
              <div key={index} className="conversation-query query-container">
                <BsPersonCircle />
                <p>{obj.text}</p>
              </div>
            ) : (
              <div key={index} className="conversation-reponse query-container">
                <img src={ChatGPTsvg} alt="" />
                <p>{obj.text}</p>
              </div>
            )
          )}
          {loading ? (
            <div className="conversation-reponse query-container">
              <img src={ChatGPTsvg} alt="" />
              <p>.........</p>
            </div>
          ) : (
            <></>
          )}
        </div>
        <form className="app-input-container" onSubmit={handleQuerySubmit}>
          <input
            type="text"
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" disabled={!prompt || loading}>
            <RiSendPlaneFill />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
