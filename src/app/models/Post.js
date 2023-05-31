import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";


const PostSchema = new mongoose.Schema({
  User: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  },
  description: {
    type: String,
  },
  photo: {
    type: Array,
  },

  liked:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

  registration_data: {
    type: Date,
    default: Date.now,
  },
},
{ timestamps: true },
);

//add plugins
PostSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Post = mongoose.model("Post", PostSchema);

export default Post;
