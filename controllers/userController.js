import userModel from "../models/userModel.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req.body);
    const token = await user.generateJWT();
    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userModel
      .findOne({ email: req.body.email })
      .select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValid = await user.isValidPassword(req.body.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await user.generateJWT();
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const userProfileController = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    await redisClient.set(token, "logged out", "EX", 60 * 60 * 24);
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
