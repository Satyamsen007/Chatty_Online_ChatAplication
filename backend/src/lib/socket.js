import { Server } from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  },
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
}

// used to store the online users
const userSocketMap = {};
// used to store user's group memberships
const userGroupMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("users-online", Object.keys(userSocketMap));

  // Handle typing events for direct messages
  socket.on("typing", (receiverId) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", userId);
    }
  });

  socket.on("stop-typing", (receiverId) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", userId);
    }
  });

  // Handle group typing events
  socket.on("group-typing", ({ groupId }) => {
    // Get all members of the group except the sender
    const groupMembers = userGroupMap[groupId] || [];
    groupMembers.forEach(memberId => {
      if (memberId !== userId) {
        const memberSocketId = userSocketMap[memberId];
        if (memberSocketId) {
          io.to(memberSocketId).emit("group-typing", { groupId, userId });
        }
      }
    });
  });

  socket.on("group-stop-typing", ({ groupId }) => {
    // Get all members of the group except the sender
    const groupMembers = userGroupMap[groupId] || [];
    groupMembers.forEach(memberId => {
      if (memberId !== userId) {
        const memberSocketId = userSocketMap[memberId];
        if (memberSocketId) {
          io.to(memberSocketId).emit("group-stop-typing", { groupId, userId });
        }
      }
    });
  });

  // Handle group membership
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    if (!userGroupMap[groupId]) {
      userGroupMap[groupId] = [];
    }
    if (!userGroupMap[groupId].includes(userId)) {
      userGroupMap[groupId].push(userId);
    }
  });

  socket.on("leave-group", (groupId) => {
    socket.leave(groupId);
    if (userGroupMap[groupId]) {
      userGroupMap[groupId] = userGroupMap[groupId].filter(id => id !== userId);
      if (userGroupMap[groupId].length === 0) {
        delete userGroupMap[groupId];
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    // Clean up group memberships
    Object.keys(userGroupMap).forEach(groupId => {
      userGroupMap[groupId] = userGroupMap[groupId].filter(id => id !== userId);
      if (userGroupMap[groupId].length === 0) {
        delete userGroupMap[groupId];
      }
    });
    io.emit("users-online", Object.keys(userSocketMap));
  });
})

export { io, app, server }

