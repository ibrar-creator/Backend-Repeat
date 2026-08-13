import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import Nav from "../../shared/components/Nav.jsx";
import "../style/Messages.scss";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Load conversation list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/messages/conversations", {
          withCredentials: true,
        });
        const convos = res.data.conversations || [];
        setConversations(convos);
        if (convos.length > 0) setActiveConvo(convos[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Load messages for the active conversation
  useEffect(() => {
    if (!activeConvo) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/messages/${activeConvo._id || activeConvo.id}`,
          { withCredentials: true },
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [activeConvo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvo) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/messages/${activeConvo._id || activeConvo.id}`,
        { text: newMessage },
        { withCredentials: true },
      );
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="messages-page">
        {/* CONVERSATION LIST */}
        <aside className="convo-list">
          <div className="convo-list-header">
            <h3>{user?.username || "Messages"}</h3>
          </div>

          {loading && <p className="status-text">Loading chats...</p>}
          {!loading && conversations.length === 0 && (
            <p className="status-text">No conversations yet.</p>
          )}

          {conversations.map((convo) => {
            const other = convo.otherUser || {};
            const isActive =
              activeConvo &&
              (activeConvo._id || activeConvo.id) === (convo._id || convo.id);

            return (
              <button
                key={convo._id || convo.id}
                className={`convo-item${isActive ? " active" : ""}`}
                onClick={() => setActiveConvo(convo)}
              >
                <img
                  src={other.profileImage || "https://picsum.photos/id/64/80/80"}
                  alt={other.username}
                  className="convo-avatar"
                />
                <div className="convo-meta">
                  <h4>{other.username || "user"}</h4>
                  <p>{convo.lastMessage || "Say hello 👋"}</p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* CHAT WINDOW */}
        <section className="chat-window">
          {activeConvo ? (
            <>
              <div className="chat-header">
                <img
                  src={
                    activeConvo.otherUser?.profileImage ||
                    "https://picsum.photos/id/64/80/80"
                  }
                  alt=""
                  className="chat-avatar"
                />
                <h4>{activeConvo.otherUser?.username || "user"}</h4>
              </div>

              <div className="chat-messages">
                {messages.map((msg) => {
                  const isMine = msg.senderId === user?._id || msg.senderId === user?.id;
                  return (
                    <div
                      key={msg._id || msg.id}
                      className={`chat-bubble${isMine ? " mine" : ""}`}
                    >
                      {msg.text}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form className="chat-input-bar" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat">
              <p>Select a conversation to start messaging.</p>
            </div>
          )}
        </section>
      </div>
      <Nav />
    </>
  );
};

export default Messages;