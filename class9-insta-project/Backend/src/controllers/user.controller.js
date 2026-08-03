import followModel from "../models/follow.model.js";
import userModel from "../models/user.model.js";
async function followUserController(req, res) {
  const userId = req.user.userId || req.user.id;
  const followeeId = req.params.userid;
  if (userId === followeeId) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }
  const isAlreadyFollowing = await followModel.findOne({
    follower: userId,
    followee: followeeId,
  });
  if (isAlreadyFollowing) {
    return res.status(400).json({
      message: `You are already following this user ${followeeId}`,
    });
  }
  const isFolloweeExists = await userModel.findById(followeeId);
  if (!isFolloweeExists) {
    return res.status(404).json({
      message: `User with ID ${followeeId} not found`,
    });
  }
  const followRecord = await followModel.create({
    follower: userId,
    followee: followeeId,
  });

  res.status(201).json({
    message: `You are now following this user ${followeeId}`,
    follow: followRecord,
  });
}
async function unfollowUserController(req, res) {
  const userId = req.user.userId || req.user.id;
  const followeeId = req.params.userid;
  const isFollowing = await followModel.findOne({
    follower: userId,
    followee: followeeId,
  });
  if (!isFollowing) {
    return res.status(400).json({
      message: `You are not following this user ${followeeId}`,
    });
  }
  await followModel.findByIdAndDelete(isFollowing._id);
  res.status(200).json({
    message: `You are no longer following this user ${followeeId}`,
  });
}
export default { followUserController, unfollowUserController };
