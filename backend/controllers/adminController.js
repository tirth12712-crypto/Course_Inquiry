import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import Admin from '../models/Admin.js';
import FormSubmission from '../models/FormSubmission.js';

export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: admin._id }, "imbatman", {
      expiresIn: '24h',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllForms = async (req, res, next) => {
  try {
    const forms = await FormSubmission.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Form as Read
 *
 * PRODUCTION LOGIC:
 * - Only updates the isRead flag
 * - NO email sending (emails are sent on form submission)
 * - NO scheduling (not compatible with Vercel serverless)
 * - Clean, simple, stateless operation
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Update the isRead flag
    const form = await FormSubmission.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    console.log('✓ Form marked as read:', id);

    res.json({
      success: true,
      message: 'Form marked as read',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};
