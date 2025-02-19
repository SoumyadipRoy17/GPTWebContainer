import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/projectModel.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://gptwebcontainerfrontend2.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  console.log("a user connected");

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;

    const aiIsPresentInMessage = message.includes("@ai");
    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if (aiIsPresentInMessage) {
      const prompt = message.replace("@ai", "");

      const result = await generateResult(prompt);

      io.to(socket.roomId).emit("project-message", {
        message: result,
        sender: {
          _id: "ai",
          email: "AI",
        },
      });

      return;
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// import "dotenv/config";
// import http from "http";
// import app from "./app.js";
// import { Server } from "socket.io";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import projectModel from "./models/projectModel.js";
// import { generateResult } from "./services/ai.service.js";

// const port = process.env.PORT || 3000;

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://gptwebcontainerfrontend2.onrender.com",
//     ],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Add COOP/COEP headers for WebContainer support
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

// io.use(async (socket, next) => {
//   try {
//     const token =
//       socket.handshake.auth?.token ||
//       socket.handshake.headers.authorization?.split(" ")[1];
//     const projectId = socket.handshake.query.projectId;

//     if (!mongoose.Types.ObjectId.isValid(projectId))
//       return next(new Error("Invalid projectId"));

//     socket.project = await projectModel.findById(projectId);
//     if (!token) return next(new Error("Authentication error"));

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) return next(new Error("Authentication error"));

//     socket.user = decoded;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// io.on("connection", (socket) => {
//   console.log("✅ A user connected to project:", socket.project._id);

//   socket.join(socket.project._id.toString());

//   socket.on("project-message", async (data) => {
//     const message = data.message;
//     socket.broadcast.to(socket.project._id).emit("project-message", data);

//     if (message.includes("@ai")) {
//       console.log("here");
//       const result = await generateResult(message.replace("@ai", ""));
//       console.log("result", result);
//       io.to(socket.project._id).emit("project-message", {
//         message: result,
//         sender: { _id: "ai", email: "AI" },
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected");
//   });
// });

// server.listen(port, () => console.log(`🚀 Server running on port ${port}`));
