import mongoose from "mongoose";


const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  id_FromUser: {
    type: String,
    required: true,
  },
  id_ToUser:{
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  isRead:{
    type: Boolean,
    default: false,
  }
},
{ timestamps: true },);


const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
