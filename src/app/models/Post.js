import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  id_User: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  photo: {
    type: Array,
  },
  liked: {
    type: Array,
    default: [],
  },
  comment: {
    type: Array,
    default: [],
  },
  registration_data: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
