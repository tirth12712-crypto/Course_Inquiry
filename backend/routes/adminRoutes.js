import express from 'express';
import { adminLogin, getAllForms, markAsRead } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/forms', verifyToken, getAllForms);
router.put('/forms/:id/read', verifyToken, markAsRead);

export default router;
