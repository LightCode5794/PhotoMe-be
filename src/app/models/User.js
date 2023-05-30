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
  
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

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
},
{ timestamps: true },
);


const User = mongoose.model("User", UserSchema);

export default User;
