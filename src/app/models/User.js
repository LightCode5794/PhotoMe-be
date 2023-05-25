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
    type: Array,
    default: [],
  },
  follower: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  notifications: {
    type: Array,
    default: [],
  },
  registration_data: {
    type: Date,
    default: Date.now,
  },
  device_token: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
