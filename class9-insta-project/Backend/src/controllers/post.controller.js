import postModel from "../models/post.model.js";
import ImageKit from "@imagekit/nodejs";
import { toFile } from "@imagekit/nodejs";
import jwt from "jsonwebtoken";
import identifyuser from "../middlewares/auth.middleware.js";
import likeModel from "../models/like.model.js";
const imagekit = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"], // This is the default and can be omitted
});

async function createPostController(req, res) {
  const userId = req.user.userId || req.user.id;
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "test",
  });
  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: userId,
  });
  res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.userId || req.user.id;
  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  });
}
async function getPostDetailsController(req, res) {
  const postId = req.params.postId;
  const userId = req.user.userId || req.user.id;
  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  return res.status(200).json({
    message: "Post fetched  successfully.",
    post,
  });
}
async function likePostController(req, res) {
  const userId = req.user.userId || req.user.id;
  const postId = req.params.postId;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }
  const like = await likeModel.create({
    post: postId,
    user: userId,
  });

  res.status(201).json({
    message: "Post liked successfully",
    like,
  });
}
export default {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
};
