import express from "express";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Profile from "../models/Profile.js";
// import Follow from '../app/models/Follow.js';
// import auth from "../middlewares/auth.js";

const router = express.Router();
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
        { expiresIn: "1000d" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
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

//[GET]
export const getUserByID = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id, {})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
};

//[PUT]
export const updateUserByID = async (req, res, next) => {
  const id = req.params.id;
  const { avatar, name, gender, description, job, birthday } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id user" });
  }
  console.log(id);
  console.log(req.body);
  const profile = await Profile.updateOne({ _id: id }, req.body)
    .then((docs) => {
      if (docs) {
        res.status(200).json({ success: true, data: docs });
      } else {
        res.status(200).json({ success: false, data: docs });
      }
    })
    .catch((error) => {
      return res.status(400).json({ msg: "Dont update profile user" });
    });
  // const profile = await Profile.updateOne(
  //   { id_User: id },
  //   {
  //     $set: {
  //       avatar: avatar,
  //       name: name,
  //       gender: gender,
  //       description: description,
  //       job: job,
  //       birthday: birthday,
  //     },
  //   }
  // ).catch((error) => {
  //   console.log(error);
  //   return res.status(400).json({ msg: "Dont update profile user" });
  // });
  // if (!profile.nModified)
  // return res.status(400).json({ msg: "Dont update profile user" });
  // return res.status(200).json({ msg: "Update success" });
};

//[GET]
export const searchUserByName = async (req, res, next) => {
  var nameSearch = req.query.name;
  console.log(nameSearch);
  try {
    await User.find({ name: new RegExp(nameSearch, "i") }).then((user) =>
      res.json(user)
    );
  } catch (error) {
    res.status(400).json({ error: "Error" });
    console.log(error);
  }
};
