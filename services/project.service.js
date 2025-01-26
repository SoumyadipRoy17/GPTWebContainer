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
