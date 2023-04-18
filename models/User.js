import mongoose from "mongoose"
const Schema = mongoose.Schema

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
    password: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: false,
    },
    registration_data: {
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model("user", UserSchema);

export default User;