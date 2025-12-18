import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import Admin from '../models/Admin.js';
import FormSubmission from '../models/FormSubmission.js';
import { sendThankYouEmail } from '../services/emailService.js';

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

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
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
 * Mark Form as Read & Send Thank You Email
 *
 * PRODUCTION LOGIC:
 * 1. Update isRead flag with audit info (readAt, readBy)
 * 2. Send Thank You email (only once - prevents duplicates)
 * 3. Track email sent status
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First, fetch the form to check current state
    const existingForm = await FormSubmission.findById(id);

    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Prevent duplicate processing
    if (existingForm.isRead && existingForm.thankYouEmailSent) {
      return res.status(200).json({
        success: true,
        message: 'Form already processed',
        data: existingForm,
        emailSent: false,
        alreadyProcessed: true,
      });
    }

    // Update form with read status and audit info
    const updateData = {
      isRead: true,
      readAt: new Date(),
      readBy: 'admin', // Could be enhanced to use actual admin username from token
    };

    let emailSent = false;
    let emailError = null;

    // Send Thank You email only if not already sent
    if (!existingForm.thankYouEmailSent) {
      try {
        await sendThankYouEmail(
          existingForm.email,
          existingForm.name,
          existingForm.course
        );
        updateData.thankYouEmailSent = true;
        updateData.thankYouEmailSentAt = new Date();
        emailSent = true;
        console.log('Thank You email sent to:', existingForm.email);
      } catch (err) {
        // Log error but don't fail the request
        console.error('Failed to send Thank You email:', err.message);
        emailError = err.message;
      }
    }

    // Update the form in database
    const form = await FormSubmission.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log('Form marked as read:', id);

    res.json({
      success: true,
      message: emailSent
        ? 'Form marked as read and Thank You email sent'
        : 'Form marked as read',
      data: form,
      emailSent,
      emailError,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Admin Notes for a submission
 */
export const updateAdminNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const form = await FormSubmission.findByIdAndUpdate(
      id,
      { adminNotes },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    res.json({
      success: true,
      message: 'Admin notes updated',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};








