import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
connect();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//user routes
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

export default app;
