import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be between 6 and 50 characters long"),
  userController.createUserController
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be between 6 and 50 characters long"),
  userController.loginUserController
);

router.get(
  "/profile",
  authMiddleware.authUser,
  userController.userProfileController
);

router.get(
  "/logout",
  authMiddleware.authUser,
  userController.logoutUserController
);

export default router;
