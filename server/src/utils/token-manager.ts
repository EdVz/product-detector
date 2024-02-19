import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './constants';

interface TokenCreation {
    id: string;
    email: string;
    expiresIn: string;
}

export const createToken = ({ id, email, expiresIn }: TokenCreation): string => {
    const payload = { id, email };
    const jwt_secret = process.env.JWT_SECRET;

    if (typeof jwt_secret === 'undefined') {
        throw new Error('jwt_secret env var is not defined');
    }

    const token = jwt.sign(payload, jwt_secret, { expiresIn });

    return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token Not Found" });
    }

    const jwt_secret = process.env.JWT_SECRET;
    if (typeof jwt_secret === 'undefined') {
        throw new Error('jwt_secret env var is not defined');
    }
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, jwt_secret, (err, success) => {
            if (err) {
                reject(err.message);
                return res.status(401).json({ message: "Token expired" });
            } else {
                console.log("Token verification successful");
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        });
    });
};