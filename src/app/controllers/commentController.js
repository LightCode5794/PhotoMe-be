import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

//[POST]
export const createComment = async (req, res, next) => {
  const id = req.params.id;
  const { comment } = req.body;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];
  console.log(req.body);

  if (!comment) {
    return res.status(400).json({ msg: "Please enter comment" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    Post.findById(id, {})
      .then((post) => {
        User.findById(decoded.id, {})
          .then(async (user) => {
            const newComment = new Comment({
              id_Post: id,
              id_User: decoded.id,
              comment: comment,
            });
            try {
              newComment
                .save()
                .then(async (comment) => {
                  post.comment.push(comment._id);
                  await post.save();
                  return res.status(200).json(comment);
                })
                .catch((error) => {
                  return res.status(500).json({ msg: error });
                });
            } catch (error) {
              return res.status(500).json({ msg: error });
            }
          })
          .catch((error) => {
            return res.status(400).json({ msg: "Người dùng không tồn tại" });
          });
      })
      .catch((error) => {
        return res.status(400).json({ msg: "Comment không tồn tại" });
      });
  });
};

//[POST]
export const replyComment = async (req, res, next) => {
  const id = req.params.id;
  const { comment } = req.body;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];
  console.log(req.body);

  if (!comment) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    Comment.findById(id, {})
      .then((mainComment) => {
        User.findById(decoded.id, {})
          .then(async (user) => {
            const newComment = new Comment({
              id_Post: id,
              id_User: decoded.id,
              comment: comment,
            });
            try {
              newComment
                .save()
                .then(async (comment) => {
                  mainComment.reply.push(comment._id);
                  await mainComment.save();
                  return res.status(200).json(comment);
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
  });
};

//[POST]
export const likeComment = async (req, res, next) => {
  // const id = req.params.id;
  const id = req.body.id_Post;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];
  console.log(req.body);

  if (!id) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!token) {
    return res.status(400).json({ msg: "Dont find token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    Comment.findById(id, {}).then((mainComment) => {
      User.findById(decoded.id, {})
        .then(async (user) => {
          const index = mainComment.liked.indexOf(decoded.id);
          if (index > -1) {
            mainComment.liked.splice(index, 1);
          } else {
            mainComment.liked.push(decoded.id);
          }
          mainComment
            .save()
            .then(async (comment) => {
              return res.status(200).json(comment);
            })
            .catch((error) => {
              res.status(400).json({ msg: "Người dùng không tồn tại" });
            });
        })
        .catch((error) => {
          res.status(400).json({ msg: "Comment không tồn tại" });
        });
    });
  });
};

//[PUT]
export const updateComment = async (req, res, next) => {
  const id = req.params.id;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];
  if (!id) {
    return res.status(400).json({ msg: "Dont have id comment" });
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
    const comment = await Comment.updateOne(
      { _id: id, id_User: decoded.id },
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
  });
};

//[DELETE]
export const deleteComment = async (req, res, next) => {
  const id = req.params.id;
  const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];
  if (!id) {
    return res.status(400).json({ msg: "Dont have id comment" });
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
    const comment = await Comment.deleteOne({ _id: id, id_User: decoded.id })
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
