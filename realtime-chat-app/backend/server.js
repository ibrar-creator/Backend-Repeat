import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { parseCookie } from "cookie";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { mkdir } from "node:fs/promises";

import User from "./models/user.model.js";
import connectDB from "./config/db.js";
import Message from "./models/message.model.js";
import authMiddleware from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const server = createServer(app);
const onlineUsers = new Map();
const corsOrigin = process.env.CLIENT_URL || "http://localhost:5173";
const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const uploadsDirectory = path.join(process.cwd(), "uploads");
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDirectory,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
});
app.use("/uploads", express.static(uploadsDirectory));

const getRoomParticipants = (roomId) => {
  if (typeof roomId !== "string") return null;

  const participants = roomId.split("_");
  if (participants.length !== 2 || participants.some((id) => !id)) {
    return null;
  }

  return participants;
};

const canAccessRoom = (roomId, userId) => {
  const participants = getRoomParticipants(roomId);
  return participants?.includes(String(userId)) || false;
};

const addOnlineSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId) || new Set();
  sockets.add(socketId);
  onlineUsers.set(userId, sockets);
};

const removeOnlineSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return false;

  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(userId);
  return sockets.size === 0;
};

const emitToUser = (userId, event, payload) => {
  const sockets = onlineUsers.get(String(userId)) || [];
  sockets.forEach((socketId) => io.to(socketId).emit(event, payload));
};

const configureRedis = async () => {
  if (!process.env.REDIS_URL) return null;

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (error) => console.error("Redis pub error:", error.message));
  subClient.on("error", (error) => console.error("Redis sub error:", error.message));

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log("Redis Socket.IO adapter enabled");

  return async () => {
    await Promise.all([pubClient.quit(), subClient.quit()]);
  };
};

app.get("/", (req, res) => {
  res.send("Chat server is running");
});
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "realtime-chat-api",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username },
        { email },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
  
});

app.get(
  "/api/auth/me",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get user",
      });
    }
  }
);
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

app.post(
  "/api/uploads",
  authMiddleware,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file received",
      });
    }

    res.status(201).json({
      success: true,
      attachment: {
        url: `/uploads/${req.file.filename}`,
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  },
);

io.use((socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;

    if (!rawCookie) {
      return next(
        new Error("Authentication required")
      );
    }

    const cookies = parseCookie(rawCookie);

    const token = cookies.token;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    console.error(
      "Socket authentication failed:",
      error.message
    );

    next(new Error("Invalid or expired token"));
  }
});
io.on("connection", (socket) => {
  const userId = String(socket.user.id);
  addOnlineSocket(userId, socket.id);

  console.log("User connected:", socket.id);
  socket.emit("online-users", Array.from(onlineUsers.keys()));
  socket.broadcast.emit("user-online", { userId });

  socket.on("join-room", (roomId, acknowledge) => {
    const respond = typeof acknowledge === "function" ? acknowledge : () => {};

    if (!canAccessRoom(roomId, userId)) {
      socket.emit("chat-error", "You cannot join this private room");
      respond({ success: false, message: "You cannot join this private room" });
      return;
    }

    socket.join(roomId);
    respond({ success: true, roomId });

    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", async (data) => {
    try {
      const { roomId, message, receiverId, attachment } = data;
      const cleanMessage = String(message || "").trim();

      if (
        (!cleanMessage && !attachment) ||
        !socket.rooms.has(roomId) ||
        !canAccessRoom(roomId, userId) ||
        !canAccessRoom(roomId, receiverId)
      ) {
        socket.emit("chat-error", "Invalid private message");
        return;
      }

      const sender = await User.findById(userId).select("username");
      const receiver = await User.findById(receiverId).select("_id");

      if (!sender || !receiver) {
        socket.emit("chat-error", "User not found");
        return;
      }

      const roomSockets = await io.in(roomId).fetchSockets();
      const receiverInRoom = roomSockets.some(
        (roomSocket) => String(roomSocket.user.id) === String(receiverId),
      );
      const deliveredAt = receiverInRoom ? new Date() : undefined;

      const savedMessage = await Message.create({
        roomId,
        senderId: userId,
        senderName: sender.username,
        receiverId: String(receiverId),
        message: cleanMessage,
        attachment: attachment || undefined,
        status: receiverInRoom ? "delivered" : "sent",
        deliveredAt,
      });

      io.to(roomId).emit("receive-message", savedMessage);

      if (!receiverInRoom) {
        emitToUser(receiverId, "notification:new-message", {
          roomId,
          message: savedMessage,
          senderName: sender.username,
        });
      }
    } catch (error) {
      console.error("Message error:", error);
      socket.emit("chat-error", "Message could not be sent");
    }
  });

  const handleTyping = (event, data) => {
    const { roomId } = data || {};
    if (socket.rooms.has(roomId) && canAccessRoom(roomId, userId)) {
      socket.to(roomId).emit(event, { roomId, userId });
    }
  };

  socket.on("typing-start", (data) => handleTyping("typing-start", data));
  socket.on("typing-stop", (data) => handleTyping("typing-stop", data));

  const updateMessageStatus = async (event, status, data) => {
    try {
      const { messageId, roomId } = data || {};
      if (!messageId || !socket.rooms.has(roomId)) return;

      const message = await Message.findOneAndUpdate(
        {
          _id: messageId,
          roomId,
          receiverId: userId,
        },
        {
          $set: {
            status,
            ...(status === "delivered" ? { deliveredAt: new Date() } : {}),
            ...(status === "seen" ? { seenAt: new Date() } : {}),
          },
        },
        { new: true },
      );

      if (message) io.to(roomId).emit(event, message);
    } catch (error) {
      console.error("Message status error:", error);
    }
  };

  socket.on("message-delivered", (data) => {
    updateMessageStatus("message-status", "delivered", data);
  });
  socket.on("message-seen", (data) => {
    updateMessageStatus("message-status", "seen", data);
  });

  socket.on("disconnect", () => {
    const becameOffline = removeOnlineSocket(userId, socket.id);
    if (becameOffline) socket.broadcast.emit("user-offline", { userId });
    console.log("User disconnected:", socket.id);
  });
});

app.get(
  "/api/users",
  authMiddleware,
  async (req, res) => {
    try {
      const users = await User.find({
        _id: {
          $ne: req.user.userId,
        },
      })
        .select("_id username email")
        .sort({
          username: 1,
        });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

app.get(
  "/api/messages/:roomId",
  authMiddleware,
  async (req, res) => {
    try {
      const { roomId } = req.params;

      if (!canAccessRoom(roomId, req.user.userId)) {
        return res.status(403).json({
          success: false,
          message: "You cannot access this private room",
        });
      }

      const messages = await Message.find({
        roomId,
      }).sort({
        createdAt: 1,
      });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  },
);

const PORT = process.env.PORT || 3000;
let closeRedis = null;

const startServer = async () => {
  await mkdir(uploadsDirectory, { recursive: true });
  await connectDB();
  closeRedis = await configureRedis();

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

const stopServer = async (signal) => {
  console.log(`${signal} received, shutting down`);
  await new Promise((resolve) => server.close(resolve));
  if (closeRedis) await closeRedis();
  await mongoose.connection.close();
  process.exit(0);
};

process.once("SIGINT", () => stopServer("SIGINT"));
process.once("SIGTERM", () => stopServer("SIGTERM"));

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
