import express from 'express';
import { body } from 'express-validator';
import { submitForm } from '../controllers/formController.js';

const router = express.Router();

router.post(
  '/submit',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('preferredContactTime').notEmpty().withMessage('Preferred contact time is required'),
  ],
  submitForm
);

export default router;
