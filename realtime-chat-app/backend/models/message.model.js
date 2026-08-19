import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    receiverId: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    attachment: {
      url: String,
      name: String,
      mimeType: String,
      size: Number,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    deliveredAt: {
      type: Date,
    },

    seenAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;