import "dotenv/config.js";

import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/projectModel.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.use(async (socket, next) => {
  console.log("Handshake Auth:", socket.handshake.auth);
  console.log("Handshake Headers:", socket.handshake.headers);

  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers.authorization?.split(" ")[1];

  const projectId = socket.handshake.query.projectId;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return next(new Error("Invalid Project"));
  }

  socket.project = await projectModel.findById(projectId);

  if (!token) {
    console.log("No token, rejecting...");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.roomId = socket.project._id.toString();

  socket.join(socket.roomId);

  socket.on("project-message", (data) => {
    console.log("Data:", data);
    socket.to(socket.roomId).emit("project-message", data);
  });

  socket.on("event", (data) => {
    /* _ */
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
