import User from "../models/User.js";
import Post from "../models/Post.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { dateToString } from "../../configs/function.js";

dotenv.config();

//[POST]
export const createPost = async (req, res, next) => {

  const { description, photo } = req.body;

  if (!description && !photo) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {

    const userId = req.PhoToUser.id;
    const newPost = new Post({
      User: userId,
      description: description,
      photo: photo,
    });
    await newPost.save();
    ;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
    }
    user.post.push(newPost._id);

    await user.save();

    res.status(200).json({ msg: "Đăng bài thành công!" });
  }
  catch {
    return res.status(400).json({ error: 'Đăng bài không thành công' });
  }

};

//[GET]
export const getPostByID = async (req, res, next) => {
  const idPost = req.params.id;
  console.log(idPost);
  try {
    const post = await Post.findById(idPost)
      .populate({ path: 'User', select: '-password' })
      .populate({ path: 'liked', select: '-password' })
      .populate('comments')

    if (!post) {
      return res.status(404).json({ msg: "Post not found!" });
    }
    if (!post) {
      return res.status(404).json({ msg: "Post not found!" });
    }
    res.status(200).json(post);
  }
  catch (err) {
    res.status(404).json({ msg: "Get Fail!" });
  }
  // Post.findById(id, {})
  //   .then(async (data) => {
  //     await User.findById(data.User, {})
  //       .then((user) => {
  //         var copyItem = data.toObject();
  //         copyItem.user = {
  //           _id: user.id,
  //           name: user.name,
  //           email: user.email,
  //           gender: user.gender,
  //           phoneNumber: user.phoneNumber,
  //           birthday: user.birthday,
  //           avatar: user.avatar,
  //           follower: user.follower,
  //           following: user.following,
  //         };
  //         copyItem.registration_data = dateToString(
  //           copyItem.registration_data
  //         );
  //         delete copyItem.User;
  //         res.status(200).json(copyItem);
  //       })
  //       .catch((err) => console.log(err));
  //     // res.status(200).json(data);
  //   })
  //   .catch((err) => console.log(err));
};

//[GET]
export const getAllPost = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      //.populate({ path: 'User', select: '-password' })
      .populate({ path: 'liked', select: '-password' })
      .populate('comments')

    if (!posts) {
      return res.status(404).json({ msg: "Post not found!" });
    }
    if (!posts) {
      return res.status(404).json({ msg: "Post not found!" });
    }

    res.status(200).json(posts);
  }
  catch (err) {
    res.status(404).json({ msg: "Get Fail!" });
  }
  // Post.find({})
  //   .then(async (data) => {
  //     var list = [];
  //     for (var item of data) {
  //       await User.findById(item.User, {})
  //         .then((user) => {
  //           var copyItem = item.toObject();
  //           copyItem.user = {
  //             _id: user.id,
  //             name: user.name,
  //             email: user.email,
  //             gender: user.gender,
  //             phoneNumber: user.phoneNumber,
  //             birthday: user.birthday,
  //             avatar: user.avatar,
  //             follower: user.follower,
  //             following: user.following,
  //           };
  //           copyItem.registration_data = dateToString(
  //             copyItem.registration_data
  //           );
  //           delete copyItem.User;
  //           console.log(copyItem);
  //           list.push(copyItem);
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //     res.json(list);
  //     // res.json(data);
  //   })
  //   .catch((err) => console.log(err));
};

//[PUT]
export const updatePostByID = async (req, res, next) => {
  const id = req.params.id;
  const { description, photo } = req.body;
  // const token =
  //   req.headers.authorization == null
  //     ? null
  //     : req.headers.authorization.split(" ")[1];

  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  // if (!token) {
  //   return res.status(400).json({ msg: "Dont find token" });
  // }
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(400).json({ error: err });
  //   }
  const post = await Post.updateOne(
    { _id: id, User: req.PhoToUser.id },
    {
      photo: photo,
      description: description,
    }
  )
    .then((docs) => {
      if (docs) {
        Post.findById(id, {})
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => console.log(err));
        // res.status(200).json({ success: true, data: docs });
      } else {
        res.status(200).json({ success: false, data: docs });
      }
    })
    .catch((error) => {
      return res.status(400).json({ msg: "Dont update post" });
    });
  // });
};

//[Post]
export const likePost = async (req, res, next) => {
  // const id = req.params.id;
  const id = req.body.id_Post;
  // const token =
  //   req.headers.authorization == null
  //     ? null
  //     : req.headers.authorization.split(" ")[1];

  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  // if (!token) {
  //   return res.status(400).json({ msg: "Dont find token" });
  // }
  console.log(id);
  console.log(req.body);
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(400).json({ error: err });
  //   }
  Post.findById(id, {})
    .then(async (post) => {
      const index = post.liked.indexOf(req.PhoToUser.id);
      if (index > -1) {
        post.liked.splice(index, 1);
      } else {
        post.liked.push(req.PhoToUser.id);
      }
      post.save().then((newPost) => {
        return res.status(200).json(newPost);
      });
    })
    .catch((error) => {
      return res.status(400).json({ msg: "Bài viết không tồn tại" });
    });
  // });
};

//[DELETE]
export const deletePostByID = async (req, res, next) => {

  const idPost = req.params.id;

  if (!idPost) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  try {
    await Post.delete({ _id: idPost })
    res.json({ msg: 'Delete successfully!' });
  }
  catch (error) {
    return res.status(400).json({ error: error });
  }
};

//[GET]
export const searchPost = async (req, res, next) => {
  var query = req.query.query;
  console.log(query);
  try {
    await Post.find({ description: new RegExp(query, "i") }).then((post) =>
      res.json(post)
    );
  } catch (error) {
    res.status(400).json({ error: error });
    console.log(error);
  }
};
