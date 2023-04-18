import mongoose  from "mongoose"
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    id_User: {
        type: String,
        required: true,
    },
    id_Newfeed: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    registration_data: {
        type: Date,
        default: Date.now,
    }
})

const Comment =  mongoose.model("comment", CommentSchema);

export default Comment;