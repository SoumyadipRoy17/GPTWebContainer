import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    // Safely retrieve token from cookies or headers
    const token =
      req.cookies.token ||
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized user. Please authenticate" });
    }

    // Check if token is logged out in Redis
    const isLoggedOut = await redisClient.get(token);
    if (isLoggedOut) {
      res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      return res
        .status(401)
        .json({ error: "User is logged out. Please log in again." });
    }

    // Verify token and attach user to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Invalid or expired token. Please authenticate again." });
  }
};
