"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const token_manager_1 = require("../utils/token-manager");
const userRoutes = (0, express_1.Router)();
userRoutes.post('/signup', userControllers_1.userSignup);
userRoutes.post('/login', userControllers_1.userLogin);
userRoutes.post('/logout', userControllers_1.userLogout);
userRoutes.get('/auth-status', token_manager_1.verifyToken, userControllers_1.verifyUser);
exports.default = userRoutes;
//# sourceMappingURL=userRoutes.js.map