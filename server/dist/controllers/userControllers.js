"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.userLogout = exports.userLogin = exports.userSignup = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = require("bcrypt");
const constants_1 = require("../utils/constants");
const token_manager_1 = require("../utils/token-manager");
const userSignup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: 'User already registered', userExists: true });
        }
        const passwordSalt = await (0, bcrypt_1.genSalt)(10);
        const hashedPassword = await (0, bcrypt_1.hash)(password, passwordSalt);
        const user = await User_1.default.create({ email, password: hashedPassword });
        res.clearCookie(constants_1.COOKIE_NAME);
        const token = (0, token_manager_1.createToken)({
            id: user._id.toString(),
            email: user.email,
            expiresIn: "7d",
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_1.COOKIE_NAME, token, {
            path: "/",
            expires,
            domain: "localhost", //change in production 
            httpOnly: true,
            signed: true,
        });
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", cause: error.message });
    }
};
exports.userSignup = userSignup;
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not registered', userExists: false });
        }
        const isPasswordCorrect = await (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect Password', incorrectPassword: true });
        }
        res.clearCookie(constants_1.COOKIE_NAME);
        const token = (0, token_manager_1.createToken)({
            id: user._id.toString(),
            email: user.email,
            expiresIn: "7d",
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_1.COOKIE_NAME, token, {
            path: "/",
            expires,
            domain: "localhost", //change in production 
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({ message: 'User logged in successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', cause: error.message });
    }
};
exports.userLogin = userLogin;
const userLogout = async (req, res) => {
    try {
        res.clearCookie(constants_1.COOKIE_NAME).json({ message: 'User logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};
exports.userLogout = userLogout;
const verifyUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: 'User not registered or token malfunctioned' });
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: 'Permissions didnt match' });
        }
        return res.status(200).json({ message: 'OK', email: user.email });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};
exports.verifyUser = verifyUser;
//# sourceMappingURL=userControllers.js.map