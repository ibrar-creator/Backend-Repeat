import express from "express";
import postController from "../controllers/post.controller.js";
import multer from "multer";
import identifyuser from "../middlewares/auth.middleware.js";
const upload = multer({ storage: multer.memoryStorage() });
const postRouter = express.Router();

postRouter.post("/", upload.single("image"),identifyuser, postController.createPostController);
postRouter.get("/",identifyuser, postController.getPostController);
postRouter.get("/details/:postId", identifyuser, postController.getPostDetailsController);
postRouter.post("/like/:postId", identifyuser, postController.likePostController);
export default postRouter;
