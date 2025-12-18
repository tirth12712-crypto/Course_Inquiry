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
   

   const mailOptions = {
  from: process.env.EMAIL_USER, 
  to: recipientEmail,
  subject: 'About Your Pharmacy Assistant Program Inquiry',
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
        .highlight-box {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #2563eb;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
        ul {
          margin: 15px 0;
          padding-left: 20px;
        }
        ul li {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 About Your Program Inquiry</h1>
        </div>
        <div class="content">
          <p>Hi! Hope you're doing well.</p>

          <p>You had shown interest in the <strong>Pharmacy Assistant program</strong>, so I wanted to share a quick overview to help you decide if it's the right fit:</p>

          <ul>
            <li>It's a <strong>3-month online program</strong>, so you can study from anywhere in Canada.</li>
            <li><strong>Designed for beginners</strong> — no previous healthcare experience required.</li>
            <li>The training focuses on <strong>practical skills</strong> that help you work confidently in a pharmacy setting.</li>
          </ul>

          <div class="highlight-box">
            <p style="margin: 5px 0;"><strong>📌 NOC Info:</strong> 33103 — falls under Canada's Healthcare & Social Services category. (This is general info only.)</p>
            <p style="margin: 5px 0;"><strong>⚠️ Important:</strong> For anything related to immigration pathways, please connect with a licensed immigration consultant or lawyer.</p>
          </div>

          <p>If you'd like, I can help you schedule a short call to go over details and answer questions.</p>

          <p><strong>Just reply: "Yes"</strong></p>

          <p>Looking forward to hearing from you!</p>

          <p>Best regards,<br>
          <strong>Course Team</strong></p>
        </div>
        <div class="footer">
          <p>This email was sent in response to your course inquiry.</p>
        </div>
      </div>
    </body>
    </html>
  `
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

export const sendThankYouEmail = async (recipientEmail, name, course) => {
  try {
  
    const mailOptions = {
      from:"rishabh98980@gmail.com",
      to: recipientEmail,
      subject: 'Your Course Inquiry Has Been Reviewed',
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
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
            .highlight-box {
              background-color: #ecfdf5;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 20px 0;
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
            .check-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="check-icon">&#10003;</div>
              <h1>Your Inquiry Has Been Reviewed!</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <div class="highlight-box">
                <strong>Great news!</strong> Our team has reviewed your course inquiry and we're excited to help you get started.
              </div>
              <div class="course-info">
                <strong>Course of Interest:</strong> ${course}
              </div>
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>A team member will contact you within 24-48 hours</li>
                <li>We'll discuss course details, schedules, and pricing</li>
                <li>We'll answer any questions you may have</li>
                <li>We'll guide you through the enrollment process</li>
              </ul>
              <p>We appreciate your interest in our courses and look forward to helping you achieve your educational goals!</p>
              <p>If you have any immediate questions, please don't hesitate to reach out.</p>
              <p>Best regards,<br>
              <strong>Course Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Thank You email sent successfully:', info.messageId, 'to', recipientEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending Thank You email:', error.message);
    throw error;
  }
};

export default sendConfirmationEmail;
