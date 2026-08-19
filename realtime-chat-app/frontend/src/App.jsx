import { useEffect, useRef, useState } from "react";
import "./App.css";
import api from "./api";
import socket from "./socket";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [chatError, setChatError] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingVoice, setPlayingVoice] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("whisper-theme") === "dark",
  );
  const typingTimer = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingStreamRef = useRef(null);
  const recordingChunksRef = useRef([]);

  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("whisper-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((previousMessages) => {
        if (previousMessages.some((item) => item._id === data._id)) {
          return previousMessages;
        }
        return [...previousMessages, data];
      });

      if (
        currentUser &&
        data.receiverId === String(currentUser._id) &&
        data.roomId === roomId
      ) {
        socket.emit("message-seen", {
          messageId: data._id,
          roomId: data.roomId,
        });
      }
    };

    const handleStatus = (data) => {
      setMessages((previousMessages) =>
        previousMessages.map((item) => (item._id === data._id ? data : item)),
      );
    };

    const handleChatError = (error) => setChatError(error);

    socket.on("receive-message", handleMessage);
    socket.on("message-status", handleStatus);
    socket.on("chat-error", handleChatError);

    return () => {
      socket.off("receive-message", handleMessage);
      socket.off("message-status", handleStatus);
      socket.off("chat-error", handleChatError);
    };
  }, [currentUser, roomId]);
  useEffect(() => {
    if (!currentUser) return;

    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds.map((userId) => String(userId)));
    };

    const handleOnline = ({ userId }) => {
      const normalizedUserId = String(userId);

      setOnlineUsers((previous) =>
        previous.includes(normalizedUserId)
          ? previous
          : [...previous, normalizedUserId],
      );
    };

    const handleOffline = ({ userId }) => {
      const normalizedUserId = String(userId);
      setOnlineUsers((previous) =>
        previous.filter((id) => id !== normalizedUserId),
      );
    };

    const handleTyping = ({ userId, roomId }) => {
      setTypingUser({ userId, roomId });
    };

    const handleTypingStop = () => setTypingUser(null);

    const handleNotification = ({ message: incomingMessage, senderName }) => {
      setNotifications((previous) => [
        ...previous,
        { message: incomingMessage, senderName },
      ]);

      if (window.Notification?.permission === "granted") {
        new Notification(`New message from ${senderName}`, {
          body: incomingMessage.message,
        });
      }
    };

    const handleConnectError = (error) => {
      console.error("Socket connection failed:", error.message);
    };

    socket.on("online-users", handleOnlineUsers);
    socket.on("user-online", handleOnline);
    socket.on("user-offline", handleOffline);
    socket.on("typing-start", handleTyping);
    socket.on("typing-stop", handleTypingStop);
    socket.on("notification:new-message", handleNotification);
    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      socket.off("online-users", handleOnlineUsers);
      socket.off("user-online", handleOnline);
      socket.off("user-offline", handleOffline);
      socket.off("typing-start", handleTyping);
      socket.off("typing-stop", handleTypingStop);
      socket.off("notification:new-message", handleNotification);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
      setOnlineUsers([]);
    };
  }, [currentUser]);
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setCurrentUser(response.data.user);
      } catch {
        setCurrentUser(null);
      }
    };

    getCurrentUser();
  }, []);
  useEffect(() => {
    if (!currentUser) return;

    const getUsers = async () => {
      try {
        const response = await api.get("/api/users");

        setUsers(response.data.users);
      } catch {
        console.error("Failed to load users");
      }
    };

    getUsers();
  }, [currentUser]);
  const createRoomId = (user1, user2) => {
    return [user1, user2].sort().join("_");
  };
  const selectUser = async (user) => {
    if (!currentUser) return;

    const room = createRoomId(currentUser._id, user._id);

    setSelectedUser(user);
    setRoomId(room);
    setJoinedRoom("");
    setChatError("");
    setNotifications((previous) =>
      previous.filter((item) => item.message.roomId !== room),
    );

    socket.emit("join-room", room, (result) => {
      if (result?.success) {
        setJoinedRoom(room);
        return;
      }

      setChatError(result?.message || "Could not join this chat");
    });

    try {
      const response = await api.get(`/api/messages/${room}`);

      setMessages(response.data.messages);
      response.data.messages
        .filter((item) => item.receiverId === String(currentUser._id))
        .forEach((item) => {
          socket.emit("message-seen", {
            messageId: item._id,
            roomId: room,
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    if (!socket.connected || joinedRoom !== roomId) {
      setChatError(
        "Chat connection is not ready. Please select the chat again.",
      );
      return;
    }

    socket.emit("send-message", {
      roomId,
      message,
      senderId: currentUser._id,
      senderName: currentUser.username,
      receiverId: selectedUser._id,
    });

    setMessage("");
    setChatError("");
  };

  const uploadAndSend = async (file) => {
    if (!file || !selectedUser || !roomId || joinedRoom !== roomId) {
      setChatError("Open a chat before sending an attachment.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/api/uploads", formData);

      socket.emit("send-message", {
        roomId,
        message: "",
        receiverId: selectedUser._id,
        attachment: response.data.attachment,
      });
      setChatError("");
    } catch (error) {
      setChatError(error.response?.data?.message || "File upload failed");
    }
  };

  const handleFileChange = (event) => {
    const [file] = event.target.files;
    uploadAndSend(file);
    event.target.value = "";
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setChatError("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      recordingStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        recordingStreamRef.current
          ?.getTracks()
          .forEach((track) => track.stop());
        const voiceFile = new File(
          recordingChunksRef.current,
          `voice-${Date.now()}.webm`,
          { type: recorder.mimeType || "audio/webm" },
        );
        uploadAndSend(voiceFile);
        mediaRecorderRef.current = null;
        recordingStreamRef.current = null;
      };
      recorder.start();
      setIsRecording(true);
      setChatError("");
    } catch {
      setChatError("Microphone permission is required for voice messages.");
    }
  };

  const handleMessageChange = (e) => {
    const nextMessage = e.target.value;
    setMessage(nextMessage);

    if (!roomId) return;
    socket.emit(nextMessage.trim() ? "typing-start" : "typing-stop", {
      roomId,
    });

    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing-stop", { roomId });
    }, 1000);
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setCurrentUser(null);
    setSelectedUser(null);
    setMessages([]);
    setRoomId("");
    setJoinedRoom("");
    setChatError("");
    setNotifications([]);
  };

  const initials = (name = "?") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const isUserOnline = (user) => onlineUsers.includes(String(user._id));

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const attachmentUrl = (url) => new URL(url, api.defaults.baseURL).href;

  const downloadAttachment = async (attachment) => {
    try {
      const response = await api.get(attachment.url, {
        responseType: "blob",
      });
      const objectUrl = URL.createObjectURL(response.data);
      const downloadLink = document.createElement("a");

      downloadLink.href = objectUrl;
      downloadLink.download = attachment.name || "download";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setChatError("Download failed. Please try again.");
    }
  };

  const toggleVoice = (messageId) => {
    const audio = document.getElementById(`voice-${messageId}`);
    if (!audio) return;

    if (audio.paused) {
      document.querySelectorAll(".voice-audio").forEach((item) => {
        item.pause();
      });
      audio.play();
      setPlayingVoice(messageId);
    } else {
      audio.pause();
      setPlayingVoice("");
    }
  };

  if (!currentUser) {
    return (
      <main className="auth-shell">
        <button
          className="theme-toggle auth-theme-toggle"
          type="button"
          onClick={() => setDarkMode((previous) => !previous)}
          title={darkMode ? "Use light theme" : "Use dark theme"}
        >
          {darkMode ? "☀" : "☾"}
        </button>
        {showRegister ? (
          <Register
            onRegistered={() => setShowRegister(false)}
            onLoginClick={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={(user) => {
              setCurrentUser({
                ...user,
                _id: user.id,
              });
            }}
            onRegisterClick={() => setShowRegister(true)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="chat-shell">
      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="brand-mark"><i class="ri-whatsapp-line"></i></div>
          <div>
            <p className="eyebrow">Messages</p>
            <h1>WhatsApp</h1>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            title={darkMode ? "Use light theme" : "Use dark theme"}
          >
            {darkMode ? "☀" : "☾"}
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={logout}
            title="Log out"
          >
           <i class="ri-logout-box-r-line"></i>
          </button>
        </header>

        <div className="profile-strip">
          <div className="avatar avatar-self">
            {initials(currentUser.username)}
          </div>
          <div>
            <strong>{currentUser.username}</strong>
            <span>Available to chat</span>
          </div>
          <span className="presence-dot" />
        </div>

        <div className="sidebar-title-row">
          <div>
            <span className="eyebrow">Your people</span>
            <h2>Conversations</h2>
          </div>
          {notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}
        </div>

        <div className="user-list">
          {users
            .filter((user) => String(user._id) !== String(currentUser._id))
            .map((user) => {
              const online = isUserOnline(user);
              const unread = notifications.filter(
                (item) =>
                  item.message.roomId ===
                  createRoomId(currentUser._id, user._id),
              ).length;

              return (
                <button
                  className={`user-row ${selectedUser?._id === user._id ? "active" : ""}`}
                  key={user._id}
                  onClick={() => selectUser(user)}
                >
                  <span className="avatar">{initials(user.username)}</span>
                  <span className="user-copy">
                    <strong>{user.username}</strong>
                    <span>{online ? "Online now" : "Offline"}</span>
                  </span>
                  <span className="user-meta">
                    <i
                      className={`status-dot ${online ? "online" : "offline"}`}
                    />
                    {unread > 0 && <b>{unread}</b>}
                  </span>
                </button>
              );
            })}
        </div>
      </aside>

      <section className="conversation">
        {selectedUser ? (
          <>
            <header className="conversation-header">
              <div className="avatar">{initials(selectedUser.username)}</div>
              <div>
                <h2>{selectedUser.username}</h2>
                <span
                  className={
                    isUserOnline(selectedUser)
                      ? "online-label"
                      : "offline-label"
                  }
                >
                  {typingUser?.roomId === roomId
                    ? "typing..."
                    : isUserOnline(selectedUser)
                      ? "online"
                      : "last seen recently"}
                </span>
              </div>
              <button
                className="icon-button conversation-action"
                type="button"
                title="More options"
              >
                ···
              </button>
            </header>

            <div className="message-area">
              {chatError && <p className="chat-error-banner">{chatError}</p>}
              <div className="date-chip">Today</div>
              {messages.length === 0 && (
                <div className="empty-chat">
                  <div className="empty-icon">✦</div>
                  <h3>Start a conversation</h3>
                  <p>Send a little hello and make this space yours.</p>
                </div>
              )}
              {messages.map((item) => {
                const ownMessage = item.senderId === String(currentUser._id);
                return (
                  <div
                    className={`message-row ${ownMessage ? "sent" : "received"}`}
                    key={item._id}
                  >
                    <div
                      className={`message-bubble ${item.attachment ? "has-attachment" : ""}`}
                    >
                      {item.attachment?.mimeType?.startsWith("image/") && (
                        <img
                          className="message-image"
                          src={attachmentUrl(item.attachment.url)}
                          alt={item.attachment.name}
                        />
                      )}
                      {item.attachment?.mimeType?.startsWith("audio/") && (
                        <div className="voice-card">
                          <audio
                            id={`voice-${item._id}`}
                            className="voice-audio"
                            src={attachmentUrl(item.attachment.url)}
                            onEnded={() => setPlayingVoice("")}
                          />
                          <button
                            className="voice-play"
                            type="button"
                            onClick={() => toggleVoice(item._id)}
                            title={
                              playingVoice === item._id
                                ? "Pause voice message"
                                : "Play voice message"
                            }
                          >
                            {playingVoice === item._id ? "Ⅱ" : "▶"}
                          </button>
                          <div
                            className={`voice-wave ${playingVoice === item._id ? "active" : ""}`}
                            aria-hidden="true"
                          >
                            {Array.from({ length: 30 }, (_, index) => (
                              <i
                                key={index}
                                style={{
                                  height: `${8 + ((index * 13) % 20)}px`,
                                }}
                              />
                            ))}
                          </div>
                          <span className="voice-label">Voice message</span>
                        </div>
                      )}
                      {item.attachment &&
                        !item.attachment.mimeType?.startsWith("image/") &&
                        !item.attachment.mimeType?.startsWith("audio/") && (
                          <a
                            className="file-attachment"
                            href={attachmentUrl(item.attachment.url)}
                            download={item.attachment.name}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="file-type-icon">
                              {item.attachment.mimeType
                                ?.split("/")
                                .pop()
                                ?.toUpperCase()
                                .slice(0, 3) || "FILE"}
                            </span>
                            <span>
                              <strong>{item.attachment.name}</strong>
                              <small>
                                {Math.ceil(item.attachment.size / 1024)} KB ·
                                Download
                              </small>
                            </span>
                          </a>
                        )}
                      {item.attachment && (
                        <button
                          className="attachment-download"
                          type="button"
                          onClick={() => downloadAttachment(item.attachment)}
                          title={`Download ${item.attachment.name}`}
                        >
                          <span className="download-arrow"><i class="ri-download-2-line"></i></span>
                        </button>
                      )}
                      {item.message && <p>{item.message}</p>}
                      <span>
                        {formatTime(item.createdAt)}{" "}
                        {ownMessage && (
                          <b>{item.status === "seen" ? "✓✓" : "✓"}</b>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form className="composer" onSubmit={sendMessage}>
              <input
                ref={fileInputRef}
                className="hidden-file-input"
                type="file"
                onChange={handleFileChange}
              />
              <button
                className="composer-icon"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach a file"
              >
                +
              </button>
              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={handleMessageChange}
              />
              <button
                className={`voice-button ${isRecording ? "recording" : ""}`}
                type="button"
                onClick={toggleRecording}
                title={isRecording ? "Stop recording" : "Record voice message"}
              >
                {isRecording ? <i class="ri-send-plane-2-fill"></i> : <i class="ri-mic-fill"></i>}
              </button>
              <button
                className="send-button"
                type="submit"
                title="Send message"
              >
                <i class="ri-send-plane-2-fill"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="welcome-panel">
            <div className="welcome-orbit">
              <span>✦</span>
            </div>
            <p className="eyebrow">A quieter way to talk</p>
            <h2>
              Choose someone
              <br />
              to start a chat.
            </h2>
            <p>Your private conversations, kept simple and close.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
