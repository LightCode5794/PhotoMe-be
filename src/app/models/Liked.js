import mongoose  from "mongoose"
const Schema = mongoose.Schema

const LikedSchema = new Schema({
    id_User: {
        type: String,
        required: true,
    },
    id_Newfeed: {
        type: String,
        required: true,
    },
    liked: {
        type: Boolean,
        required: true,
    },
    registration_data: {
        type: Date,
        default: Date.now,
    }
})

const Liked = mongoose.model("liked", LikedSchema)
export default Liked;