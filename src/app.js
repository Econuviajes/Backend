import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import cors from 'cors';

// Importamos las rutas para usuarios
import authRoutes from './routes/user.routes.js'
// Importamos las rutas para viajes
import viajeRoutes from './routes/viajes.routes.js'

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); //Cookies en formato JSON
app.use(express.urlencoded({extended: false})); 

// Indicamos que inicie el objeto authRoutes
// https://localhost:3000/api/login     o /api/register
app.use('/api/', authRoutes)
app.use('/api/', viajeRoutes);

export default app;