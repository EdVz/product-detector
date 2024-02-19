"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.findProduct = exports.findAllProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const findAllProducts = async (req, res) => {
    try {
        const products = await product_1.default.find({ createdBy: res.locals.jwtData.id });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};
exports.findAllProducts = findAllProducts;
const findProduct = async (req, res) => {
    try {
        const product = await product_1.default.findOne({ name: req.params.productName, createdBy: res.locals.jwtData.id });
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};
exports.findProduct = findProduct;
const createProduct = async (req, res) => {
    try {
        const product = await product_1.default.create(req.body);
        product.createdBy = res.locals.jwtData.id;
        product.save();
        res.status(201).json({ message: 'Product created successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=productController.js.map