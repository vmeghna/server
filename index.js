import express from "express";
import router from "./routes/blogRoutes.js";
import route from "./routes/userRoutes.js";
import cors from "cors";
import mongoose from "mongoose";
import UsersModel from "./Models/Users.js";
import bcrypt from "bcrypt";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);
app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use("/api/v1/posts", router);
app.use("/api/v1/credentials", route);

// mongoose.connect("mongodb://127.0.0.1:27017/BlogDB");
mongoose.connect(
  "mongodb+srv://megvelusk97:cqn9rN4M6jtQRssU@cluster0.rda337y.mongodb.net/"
);

app.get("/", (req, res) => {
  res.status(200).send("<h2>Home Page</h2>");
});

//Login
app.post(`/login`, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModel.findOne({ email });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        res.json({
          success: true,
          _id: user._id,
          userEmail: user.email,
          name: user.name,
        });
      } else {
        res.status(401).json({
          success: false,
          error: "The password is incorrect",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        error: "The Email is not Registered with us",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

//fetching user details
app.get("/userDetails", async (req, res) => {
  try {
    const { email } = req.query;
    console.log("Fetching user details for email:", email);

    const user = await UsersModel.findOne({ email });

    if (user) {
      console.log("User found:", user);
      res.json({ name: user.name });
    } else {
      console.log("User not found for email:", email);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

//fetch user details based on its id
app.get("/userDetails/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UsersModel.findById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});
