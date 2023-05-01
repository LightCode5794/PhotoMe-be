import User from "../models/User.js";
import Comment from "../models/Comment.js";
import dotenv from "dotenv";
import Post from "../models/Post.js";

dotenv.config();

//[POST]
export const createComment = async (req, res, next) => {
  const id = req.params.id;
  const { id_User, comment } = req.body;
  console.log(req.body);

  if (!id_User || !comment) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  Post.findById(id, {})
    .then((post) => {
      User.findById(id_User, {})
        .then(async (user) => {
          const newComment = new Comment({
            id_Post: id,
            id_User: id_User,
            comment: comment,
          });
          try {
            newComment
              .save()
              .then(async (comment) => {
                post.comment.push(comment._id);
                await post.save();
                return res.status(200).json({
                  id_User: comment.id_User,
                  id_Post: comment.id_Post,
                  comment: comment.comment,
                  liked: comment.liked,
                  reply: comment.reply,
                  registration_data: comment.registration_data,
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
    })
    .catch((error) => {
      res.status(400).json({ msg: "Comment không tồn tại" });
    });
};

//[POST]
export const replyComment = async (req, res, next) => {
  const id = req.params.id;
  const { id_User, comment } = req.body;
  console.log(req.body);

  if (!id_User || !comment) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  Comment.findById(id, {})
    .then((mainComment) => {
      User.findById(id_User, {})
        .then(async (user) => {
          const newComment = new Comment({
            id_Post: id,
            id_User: id_User,
            comment: comment,
          });
          try {
            newComment
              .save()
              .then(async (comment) => {
                mainComment.reply.push(comment._id);
                await mainComment.save();
                return res.status(200).json({
                  id_User: comment.id_User,
                  id_Post: comment.id_Post,
                  comment: comment.comment,
                  liked: comment.liked,
                  reply: comment.reply,
                  registration_data: comment.registration_data,
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
    })
    .catch((error) => {
      res.status(400).json({ msg: "Comment không tồn tại" });
    });
};

//[POST]
export const likeComment = async (req, res, next) => {
  const id = req.params.id;
  const id_User = req.body.id_User;
  console.log(req.body);

  if (!id_User) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  Comment.findById(id, {})
    .then((mainComment) => {
      User.findById(id_User, {})
        .then(async (user) => {
          const index = mainComment.liked.indexOf(id_User);
          if (index > -1) {
            mainComment.liked.splice(index, 1);
          } else {
            mainComment.liked.push(id_User);
          }
          mainComment.save().then(async (comment) => {
            return res.status(200).json({
              id_User: comment.id_User,
              id_Post: comment.id_Post,
              comment: comment.comment,
              liked: comment.liked,
              reply: comment.reply,
              registration_data: comment.registration_data,
            });
          });
        })
        .catch((error) => {
          res.status(400).json({ msg: "Người dùng không tồn tại" });
        });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Comment không tồn tại" });
    });
};

//[PUT]
export const updateComment = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id comment" });
  }
  console.log(id);
  console.log(req.body);
  const user = await Comment.updateOne(
    { _id: id },
    { comment: req.body.comment }
  )
    .then((docs) => {
      if (docs) {
        res.status(200).json({ success: true, data: docs });
      } else {
        res.status(200).json({ success: false, data: docs });
      }
    })
    .catch((error) => {
      return res.status(400).json({ msg: "Dont update comment" });
    });
};

//[DELETE]
export const deleteComment = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id comment" });
  }
  console.log(id);
  console.log(req.body);
  const user = await Comment.deleteOne({ _id: id })
    .then((docs) => {
      if (docs) {
        res.status(200).json({ success: true, data: docs });
      } else {
        res.status(200).json({ success: false, data: docs });
      }
    })
    .catch((error) => {
      return res.status(400).json({ msg: "Dont delete comment" });
    });
};

//[GET]
export const getAllCommentPost = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  try {
    await Comment.find({ id_Post: id }).then((comment) => res.json(comment));
  } catch (error) {
    res.status(400).json({ error: "Error" });
    console.log(error);
  }
};

//[GET] //Todo chưa code @@
export const getAllReplyComment = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  try {
    await Comment.find({ id_Post: id }).then((comment) => res.json(comment));
  } catch (error) {
    res.status(400).json({ error: "Error" });
    console.log(error);
  }
};
