import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { dateToString } from "../../configs/function.js";
import Notification from "../models/Notification.js";
import fetch from "node-fetch";
`
dotenv.config();`;

//[POST]
export const createNotification = async (req, res, next) => {
  const { text, fromUserID, toUserID, postID } = req.body;
  // const token =
  //   req.headers.authorization == null
  //     ? null
  //     : req.headers.authorization.split(" ")[1];
  // console.log(req.body);
  // if (!token) {
  //   return res.status(400).json({ msg: "Dont find token" });
  // }
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(400).json({ error: err });
  //   }
  // });
  // const fromUserID = req.PhoToUser.id;
  User.findById(toUserID, {}).then((user) => {
    const newNotification = new Notification({
      id_FromUser: fromUserID,
      id_ToUser: user._id,
      text: text,
      id_Post: postID,
    });
    try {
      newNotification
        .save()
        .then(async (notification) => {
          user.notifications.push(notification._id);
          await user.save();

          User.findById(fromUserID, {})
            .then(async (fromUser) => {
              const body = {
                to: user.device_token,
                notification: {
                  body: fromUser.name.concat(" ", text),
                  OrganizationId: "2",
                  content_available: true,
                  priority: "high",
                  subtitle: text,
                  title: "PhotoMe",
                },
              };

              const response = await fetch(
                "https://fcm.googleapis.com/fcm/send",
                {
                  method: "post",
                  body: JSON.stringify(body),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization:
                      "key=AAAA6cObE38:APA91bEi90bNc5_SF2JuHbIodctpNUucNABJ4niET3OYkI94qa5itb-2vFFN_IQ5EX9AYWhTUsJ4IfAufCcR12nCNy1NKD7FA2DBQmfuujsg85rs_sYn60w7yJ4M7qHgN0Y42yGkli4N",
                  },
                }
              );
              console.log(response);
              return res.status(200).json(notification);
            })
            .catch((error) => {
              return res.status(500).json({ msg: error });
            });
        })
        .catch((error) => {
          return res.status(500).json({ msg: error });
        });
    } catch {
      (err) => console.log(err);
    }
  });
};

//[GET]
export const getNotification = async (req, res, next) => {
  const id = req.params.id;
  const { text, fromUserID, toUserID } = req.body;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];
  console.log(req.body);

  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    Notification.findById(id, {})
      .then(async (data) => {
        var copyItem = data.toObject();

        User.findById(copyItem.id_FromUser, {})
          .then((user) => {
            copyItem.time = dateToString(copyItem.time);
            copyItem.to_user = user;
            res.status(200).json(copyItem);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

export const readNotification = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    await Notification.updateOne(
      { _id: id },
      { $set: { isRead: true } },
    )
    return res.status(200).json(true);
  } catch {
    return res.status(400).json({ msg: "Create comment fail!" });
  }
};
