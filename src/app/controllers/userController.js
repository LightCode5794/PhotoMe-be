import User from "../models/User.js";
import Post from "../models/Post.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dateToString } from "../../configs/function.js";
import Notification from "../models/Notification.js";
import { getNotification } from "./notificationController.js";

dotenv.config();

//[POST]
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ err: "Enter all fields" });
  }

  User.findOne({ email }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: "Email or Password incorrect" });
    bcryptjs.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "365d" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              password: user.password,
              gender: user.gender,
              phoneNumber: user.phoneNumber,
              birthday: user.birthday,
              avatar: user.avatar,
              description: user.description,
              job: user.job,
            },
          });
        }
      );
    });
  });
};

//[POST]
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, gender, phoneNumber, birthday, job } =
    req.body;

  if (!email || !password || !gender || !phoneNumber || !name) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // console.log(req.body)

  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User Exists" });
    const newUser = new User({
      name: name ?? "name",
      email: email,
      password: password,
      gender: gender,
      phoneNumber: phoneNumber,
      birthday: birthday ?? "1/1/2002",
      avatar: "",
      description: "",
      job: job ?? "job",
    });
    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(newUser.password, salt, (err, hash) => {
        if (err)
          return res.status(400).json({ msg: "Error hashing a password" });
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              { expiresIn: "24h" },
              (err, token) => {
                if (err) throw { err };
                return res.status(200).json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    password: user.password,
                    phoneNumber: user.phoneNumber,
                    birthday: user.birthday,
                    avatar: user.avatar,
                    description: user.description,
                    job: user.job,
                  },
                });
              }
            );
          })
          .catch((err) => {
            console.log(err);
            res.status(401).send(err);
          });
      });
    });
    console.log(req.body);
  });
};

//[POST]
export const updatePassword = async (req, res, next) => {
  const password = req.body.password;
  if (!password) {
    return res.status(400).json({ msg: "Dont have new password" });
  }
  bcryptjs.genSalt(10, (err, salt) => {
    bcryptjs.hash(password, salt, async (err, hash) => {
      if (err) return res.status(400).json({ msg: "Error hashing a password" });
      const user = await User.updateOne(
        { _id: req.PhoToUser.id },
        {
          password: hash,
        }
      )
        .then((docs) => {
          if (docs) {
            res.status(200).json({ success: true, data: docs });
          } else {
            res.status(200).json({ success: false, data: docs });
          }
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ msg: "Dont update profile user", error: error });
        });
    });
  });
};

//[PUT]
export const updateDeviceToken = async (req, res, next) => {
  const id = req.params.id;

  const { deviceToken } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }

  if (id === req.PhoToUser.id) {
    const user = await User.updateOne(
      { _id: id },
      {
        device_token: deviceToken,
      }
    )
      .then((docs) => {
        if (docs) {
          User.findById(id, {})
            .then((data) => {
              res.status(200).json(data);
            })
            .catch((err) => console.log(err));
          // res.status(200).json({ success: true, data: docs });
        } else {
          print("hmm");
          res.status(400).json({ success: false, data: docs });
        }
      })
      .catch((error) => {
        print(error);
        return res
          .status(400)
          .json({ msg: "Dont update profile user", error: error });
      });
  } else {
    print("error");
    return res.status(400).json({ error: "token không trùng khớp" });
  }
};

//[GET]
export const getDeviceTokenByID = async (req, res, next) => {
  console.log("get user by id");

  const id = req.params.id;
  console.log(id);
  User.findById(id, {})
    .then((data) => {
      console.log(data.device_token);
      res.status(200).json(data.device_token);
    })
    .catch((err) => console.log(err));
};

//[GET]
export const getUserByID = async (req, res, next) => {
  console.log("get user by id");

  const id = req.params.id;
  console.log(id);
  User.findById(id, { delete: false })
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((err) => console.log(err));
};

//[PUT]
export const updateUserByID = async (req, res, next) => {
  const id = req.params.id;

  const { name, gender, birthday, job, avatar, description } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  if (id === req.PhoToUser.id) {
    const user = await User.updateOne(
      { _id: id },
      {
        name: name,
        gender: gender,
        birthday: birthday,
        avatar: avatar,
        description: description,
        job: job,
      }
    )
      .then((docs) => {
        if (docs) {
          User.findById(id, {})
            .then((data) => {
              res.status(200).json(data);
            })
            .catch((err) => console.log(err));
          // res.status(200).json({ success: true, data: docs });
        } else {
          res.status(400).json({ success: false, data: docs });
        }
      })
      .catch((error) => {
        return res
          .status(400)
          .json({ msg: "Dont update profile user", error: error });
      });
  } else {
    return res.status(400).json({ error: "token không trùng khớp" });
  }
};

//[DELETE]
export const deleteUserByID = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  if (id === req.PhoToUser.id) {
    const user = await User.deleteOne({ _id: id })
      .then((docs) => {
        if (docs) {
          res.status(200).json({ success: true, data: docs });
        } else {
          res.status(200).json({ success: false, data: docs });
        }
      })
      .catch((error) => {
        return res.status(400).json({ msg: "Dont delete user", error: error });
      });
  } else {
    return res.status(400).json({ error: "token không trùng khớp" });
  }
};

//[GET]
export const searchUserByName = async (req, res, next) => {
  var nameSearch = req.query.name;
  // console.log("haiz");
  try {
    await User.find({ name: new RegExp(nameSearch, "i") }).then((user) => {
      console.log(user);
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log(error);
  }
};

//[GET]
export const getFollowing = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id, {})
    .then((mainUser) => {
      User.find(
        {
          _id: {
            $in: mainUser.following.map(
              (item) => new mongoose.Types.ObjectId(item)
            ),
          },
        },
        {}
      )
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.json({ error: error });
        });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

//[GET]
export const getFollower = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id, {})
    .then((mainUser) => {
      User.find(
        {
          _id: {
            $in: mainUser.follower.map(
              (item) => new mongoose.Types.ObjectId(item)
            ),
          },
        },
        {}
      )
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.json({ error: error });
        });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

//[GET]
export const getNotifications = async (req, res, next) => {
  const id = req.params.id;
  console.log("get post");
  User.findById(id, {})
    .then((mainUser) => {
      console.log(mainUser.post);
      Notification.find(
        {
          _id: {
            $in: mainUser.notifications.map(
              (item) => new mongoose.Types.ObjectId(item)
            ),
          },
        },
        {}
      )
        .then(async (data) => {
          var list = [];
          // console.log(data);
          for (var item of data) {
            await User.findById(item.id_FromUser, {})
              .then(async (user) => {
                await Post.findById(item.id_Post, {})
                  .then(async (post) => {
                    await User.findById(item.id_ToUser, {}).then(
                      (postUser) => {
                        var copyItem = item.toObject();
                        copyItem.to_user = user;
                        copyItem.post = post;
                        copyItem.post.user = postUser;
                        list.push(copyItem);
                      }
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
          res.json(list);
          // res.json(data);
        })
        .catch((error) => {
          res.json({ error: error });
        });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

//[GET]
export const getPost = async (req, res, next) => {
  const idUser = req.params.id;
  console.log("get post");
  try {
    const user = await User.findById(idUser, "post").populate("post", null, {
      deleted: false,
    });

    const userInfo = await User.findById(idUser).select("-post -password  -notifications");

    const formatPostsArr = user.post.map((post) => ({
      ...post.toObject(),
      user: userInfo.toObject(),
    }));
    res.json(formatPostsArr);
  } catch (err) {
    res.json({ error: err.message });
  }

  // User.findById(idUser, {})
  //   .then((mainUser) => {
  //     Post.find(
  //       {
  //         _id: {
  //           $in: mainUser.post.map((item) => new mongoose.Types.ObjectId(item)),
  //         },
  //       },
  //       {}
  //     )
  //       .then(async (data) => {
  //         var list = [];
  //         // console.log(data);
  //         for (var item of data) {
  //           await User.findById(item.user, {})
  //             .then((user) => {
  //               var copyItem = item.toObject();
  //               copyItem.user = {
  //                 _id: user.id,
  //                 name: user.name,
  //                 email: user.email,
  //                 gender: user.gender,
  //                 phoneNumber: user.phoneNumber,
  //                 birthday: user.birthday,
  //                 avatar: user.avatar,
  //                 follower: user.follower,
  //                 following: user.following,
  //               };
  //               // copyItem.registration_data = dateToString(
  //               //   copyItem.registration_data
  //               // );
  //               delete copyItem.id_User;
  //               // console.log(copyItem._doc);
  //               list.push(copyItem);
  //             })
  //             .catch((err) => console.log(err));
  //         }
  //         res.json(list);
  //         // res.json(data);
  //       })
  //       .catch((error) => {
  //         res.json({ error: error });
  //       });
  //   })
  //   .catch((error) => {
  //     res.json({ error: error });
  //   });
};

//[POST]
export const followUser = async (req, res, next) => {
  // const id = req.params.id;
  const id_User = req.body.id_User; //được follow

  if (!id_User) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (req.PhoToUser.id === id_User)
    return res.status(500).json({ error: "trùng id" });
  User.findById(req.PhoToUser.id, {})
    .then((mainUser) => {
      User.findById(id_User, {})
        .then(async (user) => {
          var index = mainUser.following.indexOf(id_User);
          if (index > -1) {
            mainUser.following.splice(index, 1);
            index = user.follower.indexOf(req.PhoToUser.id);
            user.follower.splice(index, 1);
            console.log("hủy follow");
          } else {
            user.follower.push(req.PhoToUser.id);
            mainUser.following.push(id_User);
            console.log("follow");
          }
          try {
            await user.save();
            await mainUser.save();
            res.status(200).json({ msg: "Thành công" });
          } catch (error) {
            res.status(400).json({ msg: error });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({ msg: "Người dùng không tồn tại 1" });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ msg: "Người dùng không tồn tại 2" });
    });
};
