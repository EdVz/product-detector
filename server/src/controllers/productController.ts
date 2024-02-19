import { Request, Response } from "express";
import Product from "../models/product";

export const findAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ createdBy: res.locals.jwtData.id });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};

export const findProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne(
            { name: req.params.productName, createdBy: res.locals.jwtData.id },
        );

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.create(req.body);

        product.createdBy = res.locals.jwtData.id;
        product.save();

        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
}