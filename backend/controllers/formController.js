import { validationResult } from 'express-validator';
import FormSubmission from '../models/FormSubmission.js';
import { sendConfirmationEmail } from '../services/emailService.js';

/**
 * Form Submission Controller
 *
 * PRODUCTION LOGIC:
 * 1. Validate form data
 * 2. Save to database
 * 3. Send confirmation email IMMEDIATELY (non-blocking)
 * 4. Return success even if email fails (graceful degradation)
 */
export const submitForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, email, mobileNumber, course, preferredContactTime } = req.body;

    // Step 1: Save form submission to database
    const newForm = new FormSubmission({
      name,
      email,
      mobileNumber,
      course,
      preferredContactTime,
      isRead: false,
    });

    await newForm.save();
    console.log('✓ Form submission saved:', newForm._id);

    // Step 2: Send confirmation email immediately (non-blocking)
    // We use a try-catch to ensure email failures don't break form submission
    try {
      await sendConfirmationEmail(email, name, course);
      console.log('✓ Confirmation email sent to:', email);
    } catch (emailError) {
      // Email failed, but form submission was successful
      // Log the error but don't crash the request
      console.error('✗ Failed to send confirmation email:', emailError.message);
      console.error('  Form was saved successfully, but user will not receive email');
    }

    // Step 3: Return success response
    // Form submission succeeds regardless of email status
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newForm,
    });
  } catch (error) {
    next(error);
  }
};
