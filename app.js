import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
connect();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//user routes
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

export default app;
