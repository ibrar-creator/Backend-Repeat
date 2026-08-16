// services/userStore.js
// MongoDB based user store

const User = require("../models/user.model");

// Email se user find karo
async function findByEmail(email) {
  return await User.findOne({ email });
}

// Username se user find karo
async function findByUsername(username) {
  return await User.findOne({ username });
}

// New user create karo
async function createUser({ username, email, hashedPassword }) {
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return newUser;
}

module.exports = {
  findByEmail,
  findByUsername,
  createUser,
};