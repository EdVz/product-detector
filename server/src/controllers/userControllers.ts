import { Request, Response } from "express";
import User from "../models/User";
import { genSalt, hash, compare } from 'bcrypt';
import { COOKIE_NAME } from "../utils/constants";
import { createToken } from "../utils/token-manager";

interface User {
    email: string;
    password: string;
}

export const userSignup = async (req: Request, res: Response) => {
    try {
        const { email, password }: User = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ message: 'User already registered', userExists: true });
        }
        const passwordSalt = await genSalt(10);
        const hashedPassword = await hash(password, passwordSalt);

        const user = await User.create({ email, password: hashedPassword });

        res.clearCookie(COOKIE_NAME);

        const token = createToken({
            id: user._id.toString(),
            email: user.email,
            expiresIn: "7d",
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            expires,
            domain: "localhost", //change in production 
            httpOnly: true,
            signed: true,
        })

        return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", cause: error.message });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password }: User = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not registered', userExists: false });
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect Password', incorrectPassword: true });
        }

        res.clearCookie(COOKIE_NAME);

        const token = createToken({
            id: user._id.toString(),
            email: user.email,
            expiresIn: "7d",
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            expires,
            domain: "localhost", //change in production 
            httpOnly: true,
            signed: true,
        })

        return res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', cause: error.message });
    }
};

export const userLogout = async (req: Request, res: Response) => {
    try {
        res.clearCookie(COOKIE_NAME).json({ message: 'User logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: 'User not registered or token malfunctioned' });
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: 'Permissions didnt match' });
        }

        return res.status(200).json({ message: 'OK', email: user.email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', cause: error.message });
    }
};