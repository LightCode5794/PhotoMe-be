import mongoose  from "mongoose"

const PostSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    photo: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    }
})

const Post = mongoose.model('Post', PostSchema)
export default Post;