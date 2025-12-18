import express from 'express';
import {
  adminLogin,
  getAllForms,
  markAsRead,
  updateAdminNotes
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/forms', verifyToken, getAllForms);
router.put('/forms/:id/read', verifyToken, markAsRead);
router.put('/forms/:id/notes', verifyToken, updateAdminNotes);

export default router;
