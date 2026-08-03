import jwt from "jsonwebtoken";
async function identifyuser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let decoded;
  let userId;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: invalid token payload",
      });
    }
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: "Unauthorized: invalid or expired token",
    });
  }
  req.user = decoded;
  next();
}
export default identifyuser;
