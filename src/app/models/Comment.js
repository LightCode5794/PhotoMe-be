import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  parentComment: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },

  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  registration_data: {
    type: Date,
    default: Date.now,
  },
},
{ timestamps: true },
);

//add plugins
CommentSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
