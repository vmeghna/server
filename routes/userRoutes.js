import express from "express";
import {
  getUserById,
  updateUserProfile,
  createUserProfile,
} from "../controllers/userController.js";

const route = express.Router();

// Get user by ID
// GET => http://localhost:5000/api/v1/users/:id
route.get("/:id", getUserById);

route.post("/", createUserProfile);

route.put("/:id", updateUserProfile);

export default route;
