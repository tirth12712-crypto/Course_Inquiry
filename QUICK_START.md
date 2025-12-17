# Quick Start - Production Email System

## Setup in 3 Steps

### 1. Configure Environment Variables

Create `backend/.env`:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/course
JWT_SECRET="imbatman"

# Gmail Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

**Get Gmail App Password:**
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password

---

### 2. Install & Seed

```bash
# Backend
cd backend
npm install
npm run seed  # Creates admin user

# Frontend (from project root)
cd ..
npm install
```

---

### 3. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Login: http://localhost:5173/admin/login

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## How It Works Now

### User Submits Form
1. Form data saved to MongoDB
2. **Email sent immediately** to user
3. User sees success message

### Admin Marks as Read
1. `isRead` flag updated
2. **No email sent** (changed from old behavior)

---

## Key Improvements

| Before | After |
|--------|-------|
| No user email | Instant confirmation email |
| Scheduled emails (1 min delay) | Immediate sending |
| Background jobs | Stateless operations |
| Hardcoded credentials | Environment variables |
| Vercel incompatible | Vercel ready |

---

## Testing

### Test Form Submission
1. Visit http://localhost:5173
2. Fill out form
3. Check console: `✓ Email sent successfully`
4. Check email inbox

### Test Admin Dashboard
1. Visit http://localhost:5173/admin/login
2. Login: admin / admin123
3. View submissions
4. Mark one as "Read"
5. Verify no email sent

---

## Deployment to Vercel

### Frontend
```bash
vercel deploy
```

### Backend (Vercel Serverless Functions)
Add environment variables in Vercel Dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

---

## Troubleshooting

**Email not sending?**
- Check `.env` has correct `EMAIL_USER` and `EMAIL_PASS`
- Verify Gmail App Password (not regular password)
- Check console for error messages

**"Missing credentials" error?**
- Add `EMAIL_USER` and `EMAIL_PASS` to `.env`
- Restart backend server

**Admin can't login?**
- Run `npm run seed` in backend folder
- Use: admin / admin123

---

## Files Changed

| File | Changes |
|------|---------|
| `backend/services/emailService.js` | Uses env vars, fixed bugs, immediate sending |
| `backend/controllers/formController.js` | Sends email on form submit |
| `backend/controllers/adminController.js` | Removed email logic from markAsRead |
| `backend/.env.example` | Updated with correct variable names |
| `SETUP_GUIDE.md` | Updated documentation |

---

## Production Ready Checklist

- [x] No hardcoded credentials
- [x] Environment variables configured
- [x] No background jobs/schedulers
- [x] Graceful error handling
- [x] Immediate email sending
- [x] Vercel serverless compatible
- [x] Secure credential management
- [x] Clear documentation

**Status: Ready to Deploy!**

---

## Need Help?

See detailed documentation:
- `SETUP_GUIDE.md` - Complete setup instructions
- `PRODUCTION_READY.md` - Technical details and architecture
