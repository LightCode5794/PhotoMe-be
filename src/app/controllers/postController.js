import User from "../models/User.js";
import dotenv from "dotenv";
import Post from "../models/Post.js";

dotenv.config();

//[POST]
export const createPost = async (req, res, next) => {
  // console.log(req.body)
  const { id_User, description, photo } = req.body;
  console.log(req.body);

  if (!id_User || (!description && !photo)) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
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
            return res.status(200).json({
              id_User: post.id_User,
              description: post.description,
              photo: post.photo,
              liked: post.liked,
              comment: post.comment,
              registration_data: post.registration_data,
            });
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
};

//[GET]
export const getPostByID = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Post.findById(id, {})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
};

//[GET]
export const getAllPost = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Post.find({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
};

//[PUT]
export const updatePostByID = async (req, res, next) => {
  const id = req.params.id;
  const { description, photo } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  console.log(id);
  console.log(req.body);
  const post = await Post.updateOne(
    { _id: id },
    {
      photo: photo,
      description: description,
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
      return res.status(400).json({ msg: "Dont update post" });
    });
};

//[Post]
export const likePostByID = async (req, res, next) => {
  const id = req.params.id;
  const id_User = req.body.id_User;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  console.log(id);
  console.log(req.body);
  Post.findById(id, {})
    .then(async (post) => {
      const index = post.liked.indexOf(id_User);
      if (index > -1) {
        post.liked.splice(index, 1);
      } else {
        post.liked.push(id_User);
      }
      post.save().then((newPost) => {
        return res.status(200).json({
          id_User: newPost.id_User,
          description: newPost.description,
          photo: newPost.photo,
          liked: newPost.liked,
          comment: newPost.comment,
          registration_data: newPost.registration_data,
        });
      });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Bài viết không tồn tại" });
    });
};

//[DELETE]
export const deletePostByID = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  console.log(id);
  console.log(req.body);
  const user = await Post.deleteOne({ _id: id })
    .then((docs) => {
      if (docs) {
        res.status(200).json({ success: true, data: docs });
      } else {
        res.status(200).json({ success: false, data: docs });
      }
    })
    .catch((error) => {
      return res.status(400).json({ msg: "Dont delete post", error: error });
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