// services/userStore.js
// MongoDB based user store

const User = require("../models/user.model");

// Username se user find karo
async function findByUsername(username) {
  return await User.findOne({ username });
}

// New user create karo
async function createUser({ username, hashedPassword }) {
  const newUser = await User.create({
    username,
    password: hashedPassword,
  });

  return newUser;
}

module.exports = {
  findByUsername,
  createUser,
};