import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { dateToString } from "../../configs/function.js";

dotenv.config();

//[POST]
export const createComment = async (req, res, next) => {
  const idPost = req.params.id;
  console.log(idPost);
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ msg: "Please enter comment" });
  }

  const post = await Post.findOne({ _id: idPost });
  console.log(post);
  if (!post) {
    return res.status(400).json({ msg: "Post not found" });
  }

  try {
    const newComment = new Comment({
      post: idPost,
      user: req.PhoToUser.id,
      comment: comment,
    });
    await newComment.save();
    // return res.status(200).json(newComment);
    post.comments.push(newComment._id);
    await post.save();

    return res.status(200).json(newComment);
  } catch {
    return res.status(400).json({ msg: "Create comment fail!" });
  }
  // Post.findById(idPost, {})
  //   .then((post) => {
  //     User.findById( req.PhoToUser.id, {})
  //       .then(async (user) => {
  //         const newComment = new Comment({
  //           Post: idPost,
  //           User:  req.PhoToUser.id,
  //           comment: comment,
  //         });
  //         try {
  //           newComment
  //             .save()
  //             .then(async (comment) => {
  //               post.comment.push(comment._id);
  //               await post.save();
  //               return res.status(200).json(comment);
  //             })
  //             .catch((error) => {
  //               return res.status(500).json({ msg: error });
  //             });
  //         } catch (error) {
  //           return res.status(500).json({ msg: error });
  //         }
  //       })
  //       .catch((error) => {
  //         return res.status(400).json({ msg: "Người dùng không tồn tại" });
  //       });
  //   })
  //   .catch((error) => {
  //     return res.status(400).json({ msg: "Comment không tồn tại" });
  //   });
};

//[POST]
export const replyComment = async (req, res, next) => {
  const id = req.params.id;
  const { comment } = req.body;
  // const token =
  //   req.headers.authorization == null
  //     ? null
  //     : req.headers.authorization.split(" ")[1];
  // console.log(req.body);

  if (!comment) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // if (!token) {
  //   return res.status(400).json({ msg: "Dont find token" });
  // }
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(400).json({ error: err });
  //   }

  try {
    const mainComment = await Comment.findById({ _id: id });
    if (!mainComment) {
      return res.status(400).json({ msg: "Comment not found" });
    }
    const newReplyComment = new Comment({
      post: id,
      user: req.PhoToUser.id,
      comment: comment,
      parentComment: mainComment._id,
    });
    await newReplyComment.save();
    mainComment.reply.push(newReplyComment._id);
    await mainComment.save();

    res.status(200).json(newReplyComment);
  } catch {
    return res.status(400).json({ msg: "Reply fail!" });
  }
  // Comment.findById(id, {})
  //   .then((mainComment) => {
  //     User.findById( req.PhoToUser.id, {})
  //       .then(async (user) => {
  //         const newComment = new Comment({
  //           Post: id,
  //           User:  req.PhoToUser.id,
  //           comment: comment,
  //         });
  //         try {
  //           newComment
  //             .save()
  //             .then(async (comment) => {
  //               mainComment.reply.push(comment._id);
  //               await mainComment.save();
  //               return res.status(200).json(comment);
  //             })
  //             .catch((error) => {
  //               return res.status(500).json({ msg: error });
  //             });
  //         } catch (error) {
  //           return res.status(500).json({ msg: error });
  //         }
  //       })
  //       .catch((error) => {
  //         res.status(400).json({ msg: "Người dùng không tồn tại" });
  //       });
  //   })
  //   .catch((error) => {
  //     res.status(400).json({ msg: "Comment không tồn tại" });
  //   });
  // });
};

//[POST]
export const likeComment = async (req, res, next) => {
  console.log("like comment");
  // const id = req.params.id;
  const id = req.body.id_comment;

  console.log(req.body);

  if (!id) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  Comment.findById(id, {})
    .then((mainComment) => {
      // User.findById( req.PhoToUser.id, {})
      //   .then(async (user) => {
      const index = mainComment.liked.indexOf(req.PhoToUser.id);
      if (index > -1) {
        mainComment.liked.splice(index, 1);
        console.log("bỏ like comment");
      } else {
        mainComment.liked.push(req.PhoToUser.id);
        console.log("like comment");
      }
      mainComment
        .save()
        .then(async (comment) => {
          // console.log(comment.registration_data.getDay().toString().padStart(2, "0"));
          return res.status(200).json(comment);
        })
        .catch((error) => {
          res.status(400).json({ msg: "Người dùng không tồn tại" });
        });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Comment không tồn tại" });
    });
  // });
};

//[PUT]
export const updateComment = async (req, res, next) => {
  const id = req.params.id;
  // const token =
  //   req.headers.authorization == null
  //     ? null
  //     : req.headers.authorization.split(" ")[1];
  if (!id) {
    return res.status(400).json({ msg: "Dont have id comment" });
  }
  // if (!token) {
  //   return res.status(400).json({ msg: "Dont find token" });
  // }
  // console.log(id);
  // console.log(req.body);
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(400).json({ error: err });
  //   }
  const comment = await Comment.updateOne(
    { _id: id, user: req.PhoToUser.id },
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
      return res.status(400).json({ msg: "Update comment Fail!!!" });
    });
  // });
};

//[DELETE]
export const deleteComment = async (req, res, next) => {
  const idComment = req.params.id;
  // const token =
  //   req.headers.authorization == null
  //     ? null
  //     : req.headers.authorization.split(" ")[1];
  if (!idComment) {
    return res.status(400).json({ msg: "Dont have id comment" });
  }
  // if (!token) {
  //   return res.status(400).json({ msg: "Dont find token" });
  // }
  // console.log(id);
  // console.log(req.body);
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(400).json({ error: err });
  //   }
  try {
    // await Comment.deleteOne({ _id: idComment, user: req.PhoToUser.id })
    const commentDeleted = await Comment.findOne({
      _id: idComment,
      user: req.PhoToUser.id,
    });

    await Post.updateOne(
      { _id: commentDeleted.post._id },
      { $pullAll: { comments: [{ _id: commentDeleted._id }] } }
    );

    await Comment.deleteOne({ _id: idComment, user: req.PhoToUser.id });

    res.status(200).json({ msg: "Delete Comment Successfully!!!" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
  // const comment = await Comment.deleteOne({ _id: id, User:  req.PhoToUser.id })
  //   .then((docs) => {
  //     if (docs) {
  //       res.status(200).json({ success: true, data: docs });
  //     } else {
  //       res.status(200).json({ success: false, data: docs });
  //     }
  //   })
  //   .catch((error) => {
  //     return res.status(400).json({ msg: "Dont delete comment" });
  //   });
  // });
};

//[GET]
export const getAllCommentPost = async (req, res, next) => {
  const idPost = req.params.id;
  if (!idPost) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  try {
    console.log(idPost);
    const comments = await Comment.find({ post: idPost }).populate({
      path: "user",
      select: "-password -device_token",
    });

    // .populate({ path: 'liked', select: '-password' })
    //.populate('reply')

    if (!comments) {
      return res.status(404).json({ msg: "Post not found!" });
    }
    if (!comments) {
      return res.status(404).json({ msg: "Post not found!" });
    }
    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ msg: "Get Fail!" });
  }
  // try {
  //   await Comment.find({ Post: id }).then(async (comment) => {
  //     var list = [];
  //     for (var item of comment) {
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
  //     res.status(200).json(list);
  //   });
  // } catch (error) {
  //   res.status(400).json({ error: "Error" });
  //   console.log(error);
  // }
};

//[GET] //Todo chưa code @@
export const getAllReplyComment = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Dont have id post" });
  }
  try {
    const comment = await Comment.findById(id);
    const repliesId = comment.reply;
    const replies = await Comment.find({ _id: { $in: repliesId } });
    // comment.reply.forEach((e) => {
    //   const reply = Comment.find(e.toString());
    //   Comment.findById(e.toString()).then((rep) => {
    //     console.log(rep);
    //     replies.push(rep);
    //   });
    // });
    res.json(replies);
  } catch (error) {
    res.status(400).json({ error: "NO" });
    console.log(error);
  }
};
