import nodemailer from 'nodemailer';

/**
 * Email Service - Production Ready
 *
 * IMPORTANT: This service uses environment variables for credentials
 * Required env vars: EMAIL_USER, EMAIL_PASS
 *
 * The transporter is initialized once when the module loads.
 * This is safe for serverless environments as long as we don't
 * use background jobs or schedulers.
 */

// Initialize transporter with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a confirmation email immediately after form submission
 *
 * @param {string} recipientEmail - User's email address
 * @param {string} name - User's name
 * @param {string} course - Selected course
 * @returns {Promise<Object>} - Email send result
 */
export const sendConfirmationEmail = async (recipientEmail, name, course) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASS in .env');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER, // Fixed: removed duplicate @gmail.com
      to: recipientEmail,
      subject: 'Thank You for Your Course Inquiry',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .course-info {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Interest!</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>

              <p>Thank you for submitting your course inquiry. We have received your information and our team will review it shortly.</p>

              <div class="course-info">
                <strong>Course Inquiry:</strong> ${course}
              </div>

              <p>Our team is excited to help you get started with your chosen course. We believe this program will be a great fit for your goals.</p>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your inquiry within 24-48 hours</li>
                <li>We'll contact you to discuss course details and enrollment</li>
                <li>You'll receive information about schedules and pricing</li>
              </ul>

              <p>If you have any immediate questions, please don't hesitate to reach out to us.</p>

              <p>We look forward to helping you achieve your educational goals!</p>

              <p>Best regards,<br>
              <strong>Course Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully:', info.messageId, 'to', recipientEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Log the error but don't crash - email failures shouldn't block form submission
    console.error('✗ Error sending email:', error.message);
    throw error;
  }
};

export default sendConfirmationEmail;
