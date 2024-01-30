import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  city: String,
  state: String,
  phnumber: String,
  profilePhoto: String,
});

const UsersModel = mongoose.model("credentials", UsersSchema);
export default UsersModel;
