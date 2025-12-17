import { useState } from 'react';
import { submitForm } from '../services/api';
import FormComponent from '../components/FormComponent';

export default function UserFormPage() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await submitForm(formData);
      setSuccessMessage('Form submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to submit form';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Course Inquiry
          </h1>
          <p className="text-slate-600 mb-8">
            Submit your details to inquire about courses.
          </p>

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errorMessage}</p>
            </div>
          )}

          <FormComponent onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
