import mongoose from 'mongoose';

const formSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    preferredContactTime: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },followUpAt: {
  type: Date,
},
followUpSent: {
  type: Boolean,
  default: false,
},

  },
  { timestamps: true }
);

export default mongoose.model('FormSubmission', formSubmissionSchema);
