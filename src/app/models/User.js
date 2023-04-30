import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  job: {
    type: String,
    required: false,
  },
  post: {
    type: [String],
    default: [],
  },
  follow: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  registration_data: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
