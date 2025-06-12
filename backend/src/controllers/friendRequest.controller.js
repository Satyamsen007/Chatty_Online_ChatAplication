import { asyncHandler } from "../helper/asyncHandler.js";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../helper/ApiResponse.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import ApiError from "../helper/ApiError.js";

export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { receiverId } = await req.params;
  const senderId = req.user._id;

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  });

  if (existingRequest) {
    return res.status(400).json(
      new ApiResponse(400, null, "Friend request already exists")
    );
  }

  const newRequest = new FriendRequest({
    senderId,
    receiverId
  });

  await newRequest.save();

  // Emit socket event
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("new-friend-request", {
      requestId: newRequest._id,
      sender: req.user
    });
  }

  res.status(201).json(
    new ApiResponse(201, newRequest, "Friend request sent successfully")
  );
});

export const getFriendRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const requests = await FriendRequest.find({
    receiverId: userId,
    status: "pending"
  }).populate("senderId", "fullName profilePicture email");

  res.status(200).json(
    new ApiResponse(200, requests, "Friend requests fetched successfully")
  );
});

export const handleFriendRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const { action } = req.body; // "accept" or "reject"
  const userId = req.user._id;

  const request = await FriendRequest.findById(requestId);

  if (!request) {
    return res.status(404).json(
      new ApiResponse(404, null, "Friend request not found")
    );
  }

  if (request.receiverId.toString() !== userId.toString()) {
    return res.status(403).json(
      new ApiResponse(403, null, "Not authorized to handle this request")
    );
  }

  if (action === "accept") {
    request.status = "accepted";
    await request.save();

    // Emit socket event
    const senderSocketId = getReceiverSocketId(request.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("friend-request-update", {
        requestId: request._id,
        status: request.status,
        receiver: req.user
      });
    }

    res.status(200).json(
      new ApiResponse(200, request, "Friend request accepted successfully")
    );
  } else {
    // Delete the request if rejected
    await FriendRequest.findByIdAndDelete(requestId);

    // Emit socket event
    const senderSocketId = getReceiverSocketId(request.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("friend-request-update", {
        requestId: request._id,
        status: "rejected",
        receiver: req.user
      });
    }

    res.status(200).json(
      new ApiResponse(200, null, "Friend request rejected and deleted successfully")
    );
  }
});

// Get all friends
export const getFriends = asyncHandler(async (req, res, next) => {
  try {
    // Find all accepted friend requests where the user is either sender or receiver
    const friendRequests = await FriendRequest.find({
      $or: [
        { senderId: req.user._id, status: 'accepted' },
        { receiverId: req.user._id, status: 'accepted' }
      ]
    }).populate('senderId receiverId', 'fullName profilePicture email');

    // Get the IDs of all friends
    const friendIds = friendRequests.map(request => {
      const isSender = request.senderId._id.toString() === req.user._id.toString();
      return isSender ? request.receiverId._id : request.senderId._id;
    });

    // Get the user details for all friends
    const friends = await User.find(
      { _id: { $in: friendIds } },
      { password: 0 }
    );

    return res.status(200).json(
      new ApiResponse(200, friends, "Friends fetched successfully")
    );
  } catch (error) {
    console.error('Error in getFriends:', error);
    throw new ApiError(500, "Error fetching friends");
  }
});

// Get sent friend requests
export const getSentFriendRequests = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log('Fetching sent friend requests for user:', userId);

    const requests = await FriendRequest.find({
      senderId: userId,
      status: "pending"
    }).populate("receiverId", "fullName profilePicture email");

    return res.status(200).json(
      new ApiResponse(200, requests, "Sent friend requests fetched successfully")
    );
  } catch (error) {
    console.error('Error in getSentFriendRequests:', error);
    throw new ApiError(500, "Error fetching sent friend requests");
  }
});