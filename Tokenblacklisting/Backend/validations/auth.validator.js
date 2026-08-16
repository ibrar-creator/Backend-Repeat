const { body } = require("express-validator");

const registerValidator = [
    body("username")
        .notEmpty()
        .withMessage("Username is required"),

    body("email")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage("Only Gmail address is allowed"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
    body("email")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage("Only Gmail address is allowed"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

module.exports = {
    registerValidator,
    loginValidator,
};