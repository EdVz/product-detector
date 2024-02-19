import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDb from './config/dbConnection';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes';
import path from 'path';

dotenv.config();

const app = express();

connectToDb();

//middlewares
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173', //change in production
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);

// ----------------Deplyment -------------------
const __dirname1 = path.resolve(__dirname, "..", "..");
console.log(__dirname1);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/client/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        res.send("API is running");
    });
}
// ----------------Deplyment -------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server listening on port 3000');

});