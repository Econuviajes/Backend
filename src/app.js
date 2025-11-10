import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import cors from 'cors';

// Importamos las rutas para usuarios
import authRoutes from './routes/user.routes.js'
// Importamos las rutas para productos
import productRoutes from './routes/products.routes.js'

const app = express();
app.use(cors({
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); //Cookies en formato JSON
app.use(express.urlencoded({extended: false})); 

// Indicamos que inicie el objeto authRoutes
// https://localhost:3000/api/login     o /api/register
app.use('/api/', authRoutes)
app.use('/api/', productRoutes);

export default app;