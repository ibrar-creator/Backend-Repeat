import followModel from "../models/follow.model.js";
import userModel from "../models/user.model.js";


async function followUserController(req, res) {
  const userId = req.user.userId || req.user.id;
  const followeeId = req.params.userid;
  const requestedStatus = normalizeStatus(
    req.body?.status ?? req.body?.Status ?? req.body?.STATUS
  );

  if (userId === followeeId) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  if (requestedStatus && !validStatuses.includes(requestedStatus)) {
    return res.status(400).json({
      message: "Status can only be pending, accepted or rejected",
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
    status: requestedStatus || "pending",
  });

  res.status(201).json({
    message: `You are now following this user ${followeeId}`,
    follow: followRecord,
  });
}

const validStatuses = ["pending", "accepted", "rejected"];

const normalizeStatus = (status) => {
  if (!status) return null;
  return status.toString().trim().toLowerCase();
};

async function updateFollowStatusController(req, res) {
  const userId = req.user.userId || req.user.id;
  const followerId = req.params.userid;

  const requestedStatus = normalizeStatus(req.body?.status);

  console.log("Requested:", requestedStatus);

  if (!requestedStatus || !validStatuses.includes(requestedStatus)) {
    return res.status(400).json({
      message: "Status can only be pending, accepted or rejected",
    });
  }

  const followRequest = await followModel.findOne({
    follower: followerId,
    followee: userId,
  });

  if (!followRequest) {
    return res.status(404).json({
      message: `No follow request found from ${followerId}`,
    });
  }

  followRequest.status = requestedStatus;
  await followRequest.save();

  res.status(200).json({
    message: `Follow request status updated to ${requestedStatus}`,
    follow: followRequest,
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
export default { followUserController, unfollowUserController, updateFollowStatusController };
