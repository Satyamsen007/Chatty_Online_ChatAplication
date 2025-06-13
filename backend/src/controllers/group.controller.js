import { asyncHandler } from "../helper/asyncHandler.js";
import Group from "../models/group.model.js";
import ApiResponse from "../helper/ApiResponse.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import cloudinary from "cloudinary";

export const createGroup = asyncHandler(async (req, res, next) => {
  const { name, description, members } = req.body;
  const creatorId = req.user._id;

  let groupPicture = "";
  if (req.body.groupPicture) {
    const uploadResponse = await uploadToCloudinary(req.body.groupPicture, 'groups/images');
    groupPicture = uploadResponse.secure_url;
  }

  const newGroup = new Group({
    name,
    description,
    creator: creatorId,
    members: [...members, creatorId],
    admins: [creatorId],
    groupPicture
  });

  await newGroup.save();

  res.status(201).json(
    new ApiResponse(201, newGroup, "Group created successfully")
  );
});

export const getGroups = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const groups = await Group.find({
    members: userId
  }).populate("members", "fullName profilePicture")
    .populate("admins", "fullName profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, groups, "Groups fetched successfully")
  );
});

export const updateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name, description, groupPicture } = req.body;
  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(404).json(
      new ApiResponse(404, null, "Group not found")
    );
  }

  let groupAvatar;

  if (groupPicture) {
    if (group.groupPicture && group.groupPicture.includes('cloudinary')) {
      const publicId = group.groupPicture.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    // Upload new image
    const uploadResponse = await uploadToCloudinary(groupPicture, 'groups/images');
    groupAvatar = uploadResponse.secure_url;
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    {
      $set: {
        name,
        description,
        groupPicture: groupAvatar
      }
    },
    { new: true }
  ).populate("members", "fullName profilePicture")
    .populate("admins", "fullName profilePicture");

  res.status(200).json(
    new ApiResponse(200, updatedGroup, "Group updated successfully")
  );
});

export const addGroupMember = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const { memberId } = req.body;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(404).json(
      new ApiResponse(404, null, "Group not found")
    );
  }

  if (!group.admins.includes(userId)) {
    return res.status(403).json(
      new ApiResponse(403, null, "Not authorized to add members")
    );
  }

  if (group.members.includes(memberId)) {
    return res.status(400).json(
      new ApiResponse(400, null, "User is already a member")
    );
  }

  group.members.push(memberId);
  await group.save();

  const updatedGroup = await Group.findById(groupId)
    .populate("members", "fullName profilePicture")
    .populate("admins", "fullName profilePicture");

  res.status(200).json(
    new ApiResponse(200, updatedGroup, "Member added successfully")
  );
});

export const addGroupMembers = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const { members } = req.body;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(404).json(
      new ApiResponse(404, null, "Group not found")
    );
  }

  if (!group.admins.includes(userId)) {
    return res.status(403).json(
      new ApiResponse(403, null, "Not authorized to add members")
    );
  }

  // Add new members if they don't exist
  const newMembers = members.filter(memberId => !group.members.includes(memberId));
  group.members.push(...newMembers);

  await group.save();

  const updatedGroup = await Group.findById(groupId)
    .populate("members", "fullName profilePicture")
    .populate("admins", "fullName profilePicture");

  return res.status(200).json(
    new ApiResponse(200, updatedGroup, "Members added successfully")
  );
});

export const leaveGroup = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(404).json(
      new ApiResponse(404, null, "Group not found")
    );
  }

  if (!group.members.includes(userId)) {
    return res.status(403).json(
      new ApiResponse(403, null, "You are not a member of this group")
    );
  }

  // Check if user is the last admin
  if (group.admins.includes(userId) && group.admins.length === 1) {
    return res.status(400).json(
      new ApiResponse(400, null, "Cannot leave group as the last admin. Please assign another admin or delete the group.")
    );
  }

  // Remove user from members and admins
  group.members = group.members.filter(member => member.toString() !== userId.toString());
  group.admins = group.admins.filter(admin => admin.toString() !== userId.toString());

  await group.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Left group successfully")
  );
});

export const removeMember = asyncHandler(async (req, res, next) => {
  const { groupId, memberId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(404).json(
      new ApiResponse(404, null, "Group not found")
    );
  }

  if (!group.admins.includes(userId)) {
    return res.status(403).json(
      new ApiResponse(403, null, "Not authorized to remove members")
    );
  }

  // Check if trying to remove an admin
  if (group.admins.includes(memberId)) {
    return res.status(400).json(
      new ApiResponse(400, null, "Cannot remove an admin from the group")
    );
  }

  // Check if member exists in the group
  if (!group.members.includes(memberId)) {
    return res.status(404).json(
      new ApiResponse(404, null, "Member not found in the group")
    );
  }

  // Remove member
  group.members = group.members.filter(member => member.toString() !== memberId.toString());
  await group.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Member removed successfully")
  );
});

export const deleteGroup = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(404).json(
      new ApiResponse(404, null, "Group not found")
    );
  }

  if (!group.admins.includes(userId)) {
    return res.status(403).json(
      new ApiResponse(403, null, "Not authorized to delete the group")
    );
  }

  await Group.findByIdAndDelete(groupId);

  return res.status(200).json(
    new ApiResponse(200, null, "Group deleted successfully")
  );
}); 