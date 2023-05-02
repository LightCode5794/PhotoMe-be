import User from "../models/User.js";
import Post from "../models/Post.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
  // console.log(req.body)
  const { name, email, password, gender, phoneNumber, birthday, job } =
    req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User Exists" });
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      gender: gender,
      phoneNumber: phoneNumber,
      birthday: birthday,
      avatar: "",
      description: "",
      job: job,
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
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
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
          .catch((err) => res.status(401).send(err));
      });
    });
    console.log(req.body);
  });
};

//[POST]
export const updatePassword = async (req, res, next) => {
  const id = req.params.id;
  const password = req.body.password;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  console.log(id);
  console.log(req.body);
  const user = await User.updateOne(
    { _id: id },
    {
      password: password,
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
};

//[GET]
export const getUserByID = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id, {})
    .then((data) => {
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
  console.log(id);
  console.log(req.body);
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
};

//[DELETE]
export const deleteUserByID = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  console.log(id);
  console.log(req.body);
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
};

//[GET]
export const searchUserByName = async (req, res, next) => {
  var nameSearch = req.query.name;
  console.log(nameSearch);
  try {
    await User.find({ name: new RegExp(nameSearch, "i") }).then((user) =>
      res.status(200).json(user)
    );
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
export const getPost = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id, {})
    .then((mainUser) => {
      console.log(mainUser.post);
      Post.find(
        {
          _id: {
            $in: mainUser.post.map((item) => new mongoose.Types.ObjectId(item)),
          },
        },
        {}
      )
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res.json({ error: error });
        });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

//[POST]
export const followingUser = async (req, res, next) => {
  const id = req.params.id;
  const id_User = req.body.id_User;
  console.log(id_User);

  if (!id_User) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findById(id, {})
    .then((mainUser) => {
      User.findById(id_User, {})
        .then(async (user) => {
          var index = mainUser.follower.indexOf(id_User);
          if (index > -1) {
            mainUser.follower.splice(index, 1);
            index = user.following.indexOf(id);
            user.following.splice(index, 1);
          } else {
            mainUser.follower.push(id_User);
            user.following.push(id);
          }
          try {
            await user.save();
            await mainUser.save();
            res.status(200).json({ msg: "Thành công" });
          } catch (error) {
            res.status(400).json({ msg: "Đã xảy ra lỗi" });
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
