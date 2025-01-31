// import projectModel from "../models/projectModel.js";

// export const createProject = async ({ name, userId }) => {
//   if (!name) {
//     throw new Error("Name is required");
//   }

//   if (!userId) {
//     throw new Error("User is required");
//   }
//   try {
//     const project = await projectModel.create({ name, users: [userId] });
//     return project;
//   } catch (error) {
//     throw new Error(`Failed to create project: ${error.message}`);
//   }
// };
import projectModel from "../models/projectModel.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }

  if (!userId) {
    throw new Error("User is required");
  }

  try {
    console.log("Creating project with name:", name, "and userId:", userId);
    const project = await projectModel.create({ name, users: [userId] });
    console.log("Project created successfully:", project);
    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const allUserProjects = await projectModel.find({ users: userId });
    return allUserProjects;
  } catch (error) {
    console.error("Error getting projects:", error);
    throw new Error(`Failed to get projects: ${error.message}`);
  }
};

export const addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!users || users.length === 0) {
    throw new Error("Users are required");
  }
  if (!userId) {
    throw new Error(
      "User has to be part of project in order to add more users to that project"
    );
  }

  const project = await projectModel.findOne({ _id: projectId, users: userId });

  if (!project) {
    throw new Error(
      "Unauthorized access ! User not authorized to add users to this project"
    );
  }

  try {
    const updatedProject = await projectModel.findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        $addToSet: { users: { $each: users } },
      },
      {
        new: true,
      }
    );
    if (!updatedProject) {
      throw new Error("Project not found");
    }

    return updatedProject;
  } catch (error) {
    console.error("Error adding user to project:", error);
    throw new Error(`Failed to add user to project: ${error.message}`);
  }
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  try {
    const project = await projectModel
      .findOne({
        _id: projectId,
      })
      .populate("users");
    return project;
  } catch (error) {
    console.error("Error getting project by ID:", error);
    throw new Error(`Failed to get project by ID: ${error.message}`);
  }
};
