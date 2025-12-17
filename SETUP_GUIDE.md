# MERN Form Management System - Setup Guide

## Project Structure

```
/project
├── /backend
│   ├── /config
│   │   └── db.js
│   ├── /models
│   │   ├── FormSubmission.js
│   │   └── Admin.js
│   ├── /controllers
│   │   ├── formController.js
│   │   └── adminController.js
│   ├── /routes
│   │   ├── formRoutes.js
│   │   └── adminRoutes.js
│   ├── /middleware
│   │   ├── errorHandler.js
│   │   └── authMiddleware.js
│   ├── /services
│   │   └── emailService.js
│   ├── /scripts
│   │   └── seedAdmin.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── /src
│   ├── /pages
│   │   ├── UserFormPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   └── AdminDashboardPage.jsx
│   ├── /components
│   │   ├── FormComponent.jsx
│   │   ├── SubmissionsTable.jsx
│   │   └── ProtectedRoute.jsx
│   ├── /services
│   │   └── api.js
│   ├── App.tsx
│   └── main.tsx
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/form-app
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**For MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/form-app
```

**Email Setup (Gmail):**

To enable automated confirmation emails:

1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password:
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
4. Use this App Password (not your regular Gmail password) for `EMAIL_PASS` in `.env`
5. Set `EMAIL_USER` to your Gmail address

**Production-Ready:** Emails are sent IMMEDIATELY when users submit the form. No delays, no scheduling, fully compatible with Vercel serverless deployment.

### 2. Seed Admin User

```bash
cd backend
npm run seed
```

This creates an admin account:
- **Username**: admin
- **Password**: admin123

### 3. Start Backend Server

```bash
cd backend
npm start
```

Backend will run on **http://localhost:5000**

### 4. Frontend Setup

In project root:

```bash
npm install
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## API Endpoints

### Public Routes

**Submit Form**
- **POST** `/api/forms/submit`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "9876543210",
    "course": "Web Development",
    "preferredContactTime": "12-3"
  }
  ```

### Admin Routes (Requires JWT Token)

**Admin Login**
- **POST** `/api/admin/login`
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGc..."
  }
  ```

**Get All Submissions**
- **GET** `/api/admin/forms`
- **Header**: `Authorization: Bearer <token>`

**Mark Form as Read**
- **PUT** `/api/admin/forms/:id/read`
- **Header**: `Authorization: Bearer <token>`
- **Note**: Only updates the isRead flag. No email is sent.

---

## Application Flows

### User Form Submission

1. User visits `/` (public page)
2. Fills out the form with:
   - Name
   - Email
   - Mobile Number
   - Course (dropdown)
   - Preferred Contact Time (dropdown)
3. Clicks Submit
4. Form validates on frontend and backend
5. Data saves to MongoDB with `isRead: false`
6. **Confirmation email sent IMMEDIATELY** to the user
7. User sees success message
8. **Note**: If email fails, form submission still succeeds (graceful degradation)

### Admin Access

1. Admin visits `/admin/login`
2. Enters username: `admin` and password: `admin123`
3. Backend validates credentials
4. JWT token generated and stored in localStorage
5. Redirected to `/admin/dashboard`
6. Dashboard fetches all form submissions
7. Admin can click "Mark as Read" to update submission status
8. UI updates immediately
9. **Note**: No emails are sent when marking as read (emails are sent immediately on form submission)

---

## Technology Stack

- **Frontend**: React + Vite + TypeScript + React Router
- **Backend**: Node.js + Express + Mongoose
- **Database**: MongoDB
- **Authentication**: JWT
- **Email**: Nodemailer (Gmail SMTP)
- **Styling**: Tailwind CSS
- **Validation**: express-validator
- **HTTP Client**: Axios
- **Deployment**: Vercel-ready (serverless compatible)

## Email Features

**Production-Ready Email System:**

When a user submits the course inquiry form:

1. Form data is saved to MongoDB
2. A confirmation email is sent **IMMEDIATELY** to the user
3. Email includes:
   - Personalized greeting with student's name
   - Thank you message for their inquiry
   - Selected course information
   - Next steps and timeline
   - Professional HTML formatting
4. If email fails, form submission still succeeds (graceful error handling)

**Key Benefits:**
- No delays or scheduling (Vercel serverless compatible)
- User receives instant confirmation
- No background jobs or timers required
- Production-ready and scalable

---

## Security Notes

- JWT tokens expire in 24 hours
- Admin credentials are hashed with bcryptjs
- All admin routes require valid JWT token
- CORS enabled for frontend-backend communication
- Input validation on both frontend and backend

---

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally: `mongod`
- Or provide valid MongoDB Atlas connection string
- Check MONGO_URI in `.env`

### Token Expired

- Clear localStorage and login again
- Tokens expire after 24 hours

### CORS Errors

- Ensure backend is running on port 5000
- Check API endpoint in `src/services/api.js`

### Email Not Sending

- Verify EMAIL_USER and EMAIL_PASSWORD are set in `.env`
- Use Gmail App Password (not regular password)
- Check server console logs for email errors
- Ensure 2-factor authentication is enabled on Gmail
- Test with a 1-minute delay first before switching to 72 hours

---

## Production Deployment

Before deploying:

1. Change JWT_SECRET to a strong random value
2. Update MONGO_URI to production MongoDB
3. Set NODE_ENV=production
4. Run `npm run build` in frontend

---

## File Organization

**Backend follows MVC pattern:**
- `models/` - Database schemas
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/` - Auth & error handling
- `services/` - Email and external services
- `config/` - Database connection
- `scripts/` - Utility scripts (seeding, etc.)

**Frontend component structure:**
- `pages/` - Route-level components
- `components/` - Reusable UI components
- `services/` - API client setup
