import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";


const PostSchema = new mongoose.Schema({
  user: {
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

  numsComment: {
    type: Number,
  },
},
{ timestamps: true },
);

//pre save

// PostSchema.pre('save', function (next) {
//   if (this.isNew) {
//     const temp = this.populate('comments', 'reply');
//     this.numsComment = temp.comments.length;
//   }
//   next();
// });

//add plugins
PostSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Post = mongoose.model("Post", PostSchema);

export default Post;
