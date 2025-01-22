import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .send({ error: "Unauthorized user . Please authenticate" });
    }

    const isLoggedOut = await redisClient.get(token);

    if (isLoggedOut) {
      res.cookie("token", "");
      return res.status(401).send({ error: "User is logged out" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};
