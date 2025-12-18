import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import formRoutes from './routes/formRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes);

// ❌ REMOVE this on Vercel
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

app.use(errorHandler);

// ✅ EXPORT — DO NOT LISTEN
export default app;
