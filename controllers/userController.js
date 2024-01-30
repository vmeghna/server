import UsersModel from "../Models/Users.js";
import bcrypt from "bcrypt";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createUserProfile = async (req, res) => {
  const {
    name,
    email,
    password,
    address,
    city,
    state,
    phnumber,
    profilePhoto,
  } = req.body;

  try {
    const existingUser = await UsersModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UsersModel({
        name,
        email,
        password: hashedPassword,
        address,
        city,
        state,
        phnumber,
        profilePhoto,
      });

      const savedUser = await newUser.save();

      res.status(201).json({ message: "Signup success", user: savedUser });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, address, city, state, phnumber, profilePhoto } =
      req.body;
    const existingUser = await UsersModel.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const updatedUser = await UsersModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          email,
          address,
          city,
          state,
          phnumber,
          profilePhoto,
        },
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
