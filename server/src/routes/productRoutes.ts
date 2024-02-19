import express from 'express';
import { createProduct, findAllProducts, findProduct } from '../controllers/productController';
import { verifyToken } from '../utils/token-manager';

const productRoutes = express.Router();

productRoutes.get('/', verifyToken, findAllProducts);
productRoutes.get('/:productName', verifyToken, findProduct);
productRoutes.post('/newProduct', verifyToken, createProduct);

export default productRoutes;