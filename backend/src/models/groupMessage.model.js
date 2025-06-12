import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text"
  }
}, { timestamps: true });

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage; 