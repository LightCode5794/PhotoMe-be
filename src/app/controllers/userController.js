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
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  const password = req.body.password;
  if (!password) {
    return res.status(400).json({ msg: "Dont have new password" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(password, salt, async (err, hash) => {
        if (err)
          return res.status(400).json({ msg: "Error hashing a password" });

        const user = await User.updateOne(
          { _id: decoded.id },
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
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  const { name, gender, birthday, job, avatar, description } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (id === decoded.id) {
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
  });
};

//[DELETE]
export const deleteUserByID = async (req, res, next) => {
  const id = req.params.id;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (id === decoded.id) {
      const user = await User.deleteOne({ _id: id })
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
            .json({ msg: "Dont delete user", error: error });
        });
    } else {
      return res.status(400).json({ error: "token không trùng khớp" });
    }
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
export const followUser = async (req, res, next) => {
  // const id = req.params.id;
  const id_User = req.body.id_User; //được follow
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1]; // đang đi follow

  if (!id_User) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    User.findById(decoded.id, {})
      .then((mainUser) => {
        User.findById(id_User, {})
          .then(async (user) => {
            var index = mainUser.following.indexOf(id_User);
            if (index > -1) {
              mainUser.following.splice(index, 1);
              index = user.follower.indexOf(decoded.id);
              user.follower.splice(index, 1);
            } else {
              user.follower.push(decoded.id);
              mainUser.following.push(id_User);
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
  });
};
