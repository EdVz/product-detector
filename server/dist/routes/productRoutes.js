"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const token_manager_1 = require("../utils/token-manager");
const productRoutes = express_1.default.Router();
productRoutes.get('/', token_manager_1.verifyToken, productController_1.findAllProducts);
productRoutes.get('/:productName', token_manager_1.verifyToken, productController_1.findProduct);
productRoutes.post('/newProduct', token_manager_1.verifyToken, productController_1.createProduct);
exports.default = productRoutes;
//# sourceMappingURL=productRoutes.js.map