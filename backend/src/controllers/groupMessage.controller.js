import { asyncHandler } from "../helper/asyncHandler.js";
import GroupMessage from "../models/groupMessage.model.js";
import Group from "../models/group.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import ApiResponse from "../helper/ApiResponse.js";
import { io } from "../lib/socket.js";

export const sendGroupMessage = asyncHandler(async (req, res, next) => {
  const { content, image, messageType = "text" } = req.body;
  const { groupId } = req.params;
  const senderId = req.user._id;

  // Check if user is a member of the group
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json(new ApiResponse(404, null, "Group not found"));
  }

  if (!group.members.includes(senderId)) {
    return res.status(403).json(new ApiResponse(403, null, "You are not a member of this group"));
  }

  let imageUrl = null;
  if (image) {
    const uploadResponse = await uploadToCloudinary(image, 'group-messages/images');
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new GroupMessage({
    senderId,
    groupId,
    content,
    image: imageUrl,
    messageType,
    readBy: [senderId] // Sender has read the message
  });

  await newMessage.save();

  // Populate sender information before emitting
  const populatedMessage = await GroupMessage.findById(newMessage._id)
    .populate('senderId', 'fullName profilePicture')
    .populate('readBy', 'fullName');

  // Emit the new message to all group members
  io.to(groupId).emit("new-group-message", populatedMessage);

  res.status(201).json(new ApiResponse(201, populatedMessage, "Group message sent successfully"));
});

export const getGroupMessages = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  // Check if user is a member of the group
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json(new ApiResponse(404, null, "Group not found"));
  }

  if (!group.members.includes(userId)) {
    return res.status(403).json(new ApiResponse(403, null, "You are not a member of this group"));
  }

  const messages = await GroupMessage.find({ groupId })
    .sort({ createdAt: 1 })
    .populate('senderId', 'fullName profilePicture')
    .populate('readBy', 'fullName');

  // Mark messages as read by the current user
  const unreadMessages = messages.filter(msg => !msg.readBy.includes(userId));
  if (unreadMessages.length > 0) {
    await GroupMessage.updateMany(
      { _id: { $in: unreadMessages.map(msg => msg._id) } },
      { $addToSet: { readBy: userId } }
    );
  }

  res.status(200).json(new ApiResponse(200, messages, "Group messages fetched successfully"));
}); 