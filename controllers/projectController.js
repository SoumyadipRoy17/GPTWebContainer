// import * as projectService from "../services/project.service.js";
// import { validationResult } from "express-validator";
// import userModel from "../models/userModel.js";

// export const createProject = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name } = req.body;
//   const loggedInUser = await userModel.findOne({ email: req.user.email });

//   const userId = loggedInUser._id;

//   try {
//     const project = await projectService.createProject({ name, userId });
//     res.status(201).json(project);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: error.message });
//   }
// };

import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";

export const createProject = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Ensure user is authenticated
  if (!req.user || !req.user.email) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  const { name } = req.body;

  try {
    // Find the logged-in user by email
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the project using the service
    const userId = loggedInUser._id;
    const project = await projectService.createProject({ name, userId });

    // Return the created project
    res.status(201).json(project);
  } catch (error) {
    console.error("Error in createProject controller:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const allUserProjects = await projectService.getAllProjectsByUserId({
      userId: loggedInUser._id,
    });
    console.log(allUserProjects);

    res.status(200).json({ projects: allUserProjects });
  } catch (error) {
    console.error("Error in getAllProjects controller:", error);
    res.status(400).json({ error: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { users, projectId } = req.body;

  const loggedInUser = await userModel.findOne({ email: req.user.email });

  if (!loggedInUser) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const project = await projectService.addUserToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      message: "Users added successfully",
      project,
    });
  } catch (error) {
    console.error("Error in addUserToProject controller:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await projectService.getProjectById({
      projectId,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error in getProjectById controller:", error);
    res.status(400).json({ error: error.message });
  }
};
