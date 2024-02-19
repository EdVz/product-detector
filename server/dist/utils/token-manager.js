"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const createToken = ({ id, email, expiresIn }) => {
    const payload = { id, email };
    const jwt_secret = process.env.JWT_SECRET;
    if (typeof jwt_secret === 'undefined') {
        throw new Error('jwt_secret env var is not defined');
    }
    const token = jsonwebtoken_1.default.sign(payload, jwt_secret, { expiresIn });
    return token;
};
exports.createToken = createToken;
const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[`${constants_1.COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token Not Found" });
    }
    const jwt_secret = process.env.JWT_SECRET;
    if (typeof jwt_secret === 'undefined') {
        throw new Error('jwt_secret env var is not defined');
    }
    return new Promise((resolve, reject) => {
        return jsonwebtoken_1.default.verify(token, jwt_secret, (err, success) => {
            if (err) {
                reject(err.message);
                return res.status(401).json({ message: "Token expired" });
            }
            else {
                console.log("Token verification successful");
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        });
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token-manager.js.map