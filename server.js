import "dotenv/config.js";

import { Server } from "socket.io";
import http from "http";
import app from "./app.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("event", (data) => {
    /* _ */
  });
  socket.on("disconnect", () => {
    /* _ */
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
