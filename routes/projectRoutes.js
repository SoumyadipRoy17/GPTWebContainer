import { Router } from "express";

import { body } from "express-validator";
import * as projectController from "../controllers/projectController.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("name").isString().withMessage("Name is required"),
  projectController.createProject
);
// router.get("/all", (req, res) => {
//   res.send("Projects endpoint is working!");
// });
router.get("/all", authMiddleware.authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authMiddleware.authUser,

  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .custom((users) => users.every((user) => typeof user === "string")),
  projectController.addUserToProject
);

router.get(
  "/get-project/:projectId",
  authMiddleware.authUser,
  projectController.getProjectById
);

export default router;
