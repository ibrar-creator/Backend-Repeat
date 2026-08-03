import express from 'express'
import UserController from '../controllers/user.controller.js'
import identifyuser from '../middlewares/auth.middleware.js'

const userRouter = express.Router()

userRouter.post("/follow/:userid",identifyuser, UserController.followUserController)

userRouter.post("/unfollow/:userid",identifyuser, UserController.unfollowUserController)
export default userRouter;