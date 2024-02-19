import { Router } from 'express';
import { userLogin, userLogout, userSignup, verifyUser } from '../controllers/userControllers';
import { verifyToken } from '../utils/token-manager';

const userRoutes = Router();

userRoutes.post('/signup', userSignup);
userRoutes.post('/login', userLogin);
userRoutes.post('/logout', userLogout);
userRoutes.get('/auth-status', verifyToken, verifyUser);

export default userRoutes;