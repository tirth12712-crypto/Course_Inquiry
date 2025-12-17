import { useState } from 'react';
import { User, Mail, Phone, BookOpen, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const COURSES = [
  'Assistant Pharmacist'
];

const CONTACT_TIMES = [
  'Morning (9 AM to 12 PM)', 
  'Afternoon (12 PM to 5 PM)', 
  'Evening (5 PM to 9 PM)'
];

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Icon size={16} className="text-blue-600" />
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-600 text-sm" data-testid={`error-${label.toLowerCase().replace(' ', '-')}`}>
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function FormComponent({ onSubmit, loading, submitted }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    course: '',
    preferredContactTime: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'mobileNumber':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Please enter a valid 10-digit number';
        return '';
      case 'course':
        if (!value) return 'Please select a course';
        return '';
      case 'preferredContactTime':
        if (!value) return 'Please select a preferred contact time';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      mobileNumber: true,
      course: true,
      preferredContactTime: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  const inputBaseClass = "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
  const inputNormalClass = `${inputBaseClass} border-slate-300 hover:border-slate-400`;
  const inputErrorClass = `${inputBaseClass} border-red-400 bg-red-50`;

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2" data-testid="text-success-title">
          Thank You!
        </h3>
        <p className="text-slate-600 mb-4" data-testid="text-success-message">
          Your inquiry has been submitted successfully. We'll be in touch soon!
        </p>
        <p className="text-sm text-slate-500">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-inquiry">
      <FormField label="Name" icon={User} error={touched.name && errors.name}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.name && touched.name ? inputErrorClass : inputNormalClass}
          placeholder="Your full name"
          disabled={loading}
          aria-invalid={!!(errors.name && touched.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          data-testid="input-name"
        />
      </FormField>

      <FormField label="Email" icon={Mail} error={touched.email && errors.email}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email && touched.email ? inputErrorClass : inputNormalClass}
          placeholder="your@email.com"
          disabled={loading}
          aria-invalid={!!(errors.email && touched.email)}
          data-testid="input-email"
        />
      </FormField>

      <FormField label="Mobile Number" icon={Phone} error={touched.mobileNumber && errors.mobileNumber}>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.mobileNumber && touched.mobileNumber ? inputErrorClass : inputNormalClass}
          placeholder="10-digit number"
          disabled={loading}
          aria-invalid={!!(errors.mobileNumber && touched.mobileNumber)}
          data-testid="input-mobile"
        />
      </FormField>

      <FormField label="Course" icon={BookOpen} error={touched.course && errors.course}>
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.course && touched.course ? inputErrorClass : inputNormalClass}
          disabled={loading}
          aria-invalid={!!(errors.course && touched.course)}
          data-testid="select-course"
        >
          <option value="">Select a course</option>
          {COURSES.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Preferred Contact Time" icon={Clock} error={touched.preferredContactTime && errors.preferredContactTime}>
        <select
          name="preferredContactTime"
          value={formData.preferredContactTime}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.preferredContactTime && touched.preferredContactTime ? inputErrorClass : inputNormalClass}
          disabled={loading}
          aria-invalid={!!(errors.preferredContactTime && touched.preferredContactTime)}
          data-testid="select-contact-time"
        >
          <option value="">Select a time</option>
          {CONTACT_TIMES.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-6"
        data-testid="button-submit"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Submitting...
          </>
        ) : (
          'Submit Inquiry'
        )}
      </button>

      <p className="text-xs text-center text-slate-500 mt-4">
        By submitting this form, you agree to be contacted regarding your course inquiry.
      </p>
    </form>
  );
}
