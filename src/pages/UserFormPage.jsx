import { useState } from 'react';
import { submitForm } from '../services/api';
import FormComponent from '../components/FormComponent';
import { AlertCircle } from 'lucide-react';

export default function UserFormPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
  setLoading(true);
  setErrorMessage('');
  
  // Show success immediately
  setSubmitted(true);

  try {
    // Submit in background
    await submitForm(formData);
  } catch (error) {
    // If it fails, revert back to the form
    setSubmitted(false);
    const message =
      error.response?.data?.message || 'Failed to submit form. Please try again.';
    setErrorMessage(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!submitted && (
            <>
              <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-form-title">
                Course Inquiry
              </h1>
              <p className="text-slate-600 mb-8">
                Submit your details to inquire about courses.
              </p>
            </>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-800 font-medium">Submission Failed</p>
                <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <FormComponent 
            onSubmit={handleSubmit} 
            loading={loading} 
            submitted={submitted}
          />
        </div>
      </div>
    </div>
  );
}
