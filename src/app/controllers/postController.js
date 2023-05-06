import User from "../models/User.js";
import Post from "../models/Post.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { dateToString } from "../../configs/function.js";

dotenv.config();

//[POST]
export const createPost = async (req, res, next) => {
  // console.log(req.body)
  const { description, photo } = req.body;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  console.log(req.body);

  if (!description && !photo) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Don't find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const id_User = decoded.id;
    User.findById(id_User, {})
      .then((user) => {
        const newPost = new Post({
          id_User: id_User,
          description: description,
          photo: photo,
        });
        try {
          newPost
            .save()
            .then(async (post) => {
              user.post.push(post._id);
              await user.save();
              return res.status(200).json(post);
            })
            .catch((error) => {
              return res.status(500).json({ msg: error });
            });
        } catch (error) {
          return res.status(500).json({ msg: error });
        }
      })
      .catch((error) => {
        res.status(400).json({ msg: "Người dùng không tồn tại" });
      });
  });
};

//[GET]
export const getPostByID = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Post.findById(id, {})
    .then(async (data) => {
      await User.findById(data.id_User, {})
        .then((user) => {
          var copyItem = data.toObject();
          copyItem.user = {
            _id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            birthday: user.birthday,
            avatar: user.avatar,
            follower: user.follower,
            following: user.following,
          };
          copyItem.registration_data = dateToString(
            copyItem.registration_data
          );
          delete copyItem.id_User;
          res.status(200).json(copyItem);
        })
        .catch((err) => console.log(err));
      // res.status(200).json(data);
    })
    .catch((err) => console.log(err));
};

//[GET]
export const getAllPost = async (req, res, next) => {
  console.log("get all post");
  const id = req.params.id;
  console.log(id);
  Post.find({})
    .then(async (data) => {
      var list = [];
      for (var item of data) {
        await User.findById(item.id_User, {})
          .then((user) => {
            var copyItem = item.toObject();
            copyItem.user = {
              _id: user.id,
              name: user.name,
              email: user.email,
              gender: user.gender,
              phoneNumber: user.phoneNumber,
              birthday: user.birthday,
              avatar: user.avatar,
              follower: user.follower,
              following: user.following,
            };
            copyItem.registration_data = dateToString(
              copyItem.registration_data
            );
            delete copyItem.id_User;
            console.log(copyItem);
            list.push(copyItem);
          })
          .catch((err) => console.log(err));
      }
      res.json(list);
      // res.json(data);
    })
    .catch((err) => console.log(err));
};

//[PUT]
export const updatePostByID = async (req, res, next) => {
  const id = req.params.id;
  const { description, photo } = req.body;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const post = await Post.updateOne(
      { _id: id, id_User: decoded.id },
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
  });
};

//[Post]
export const likePost = async (req, res, next) => {
  // const id = req.params.id;
  const id = req.body.id_Post;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  console.log(id);
  console.log(req.body);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    Post.findById(id, {})
      .then(async (post) => {
        const index = post.liked.indexOf(decoded.id);
        if (index > -1) {
          post.liked.splice(index, 1);
        } else {
          post.liked.push(decoded.id);
        }
        post.save().then((newPost) => {
          return res.status(200).json(newPost);
        });
      })
      .catch((error) => {
        return res.status(400).json({ msg: "Bài viết không tồn tại" });
      });
  });
};

//[DELETE]
export const deletePostByID = async (req, res, next) => {
  console.log("delete post");
  const id = req.params.id;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  console.log(id);
  console.log(req.body);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const post = await Post.deleteOne({ _id: id, id_User: decoded.id })
      .then((docs) => {
        if (docs.deletedCount != 0) {
          console.log("Xóa thành công");
          console.log(docs);
          return res.status(200).json({ success: true, data: docs });
        } else {
          console.log("không thể xóa");
          return res.status(500).json({ success: false, data: docs });
        }
      })
      .catch((error) => {
        console.log("Xóa gặp lỗi");
        return res.status(400).json({ msg: "Dont delete post", error: error });
      });
  });
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
