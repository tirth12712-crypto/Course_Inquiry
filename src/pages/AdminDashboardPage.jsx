import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllForms, markFormAsRead } from '../services/api';
import { LogOut, X, Mail, Phone, User, BookOpen, Calendar, CheckCircle, Circle } from 'lucide-react';

// Detail Modal Component
function FormDetailModal({ form, onClose }) {
  if (!form) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">Inquiry Details</h2>
            <p className="text-blue-100 text-sm">Submission ID: {form._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {form.isRead ? (
              <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle size={16} />
                Read
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                <Circle size={16} />
                Unread
              </span>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Personal Information</h3>
            
            <div className="flex items-start gap-3">
              <User className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="text-slate-900 font-medium">{form.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <a href={`mailto:${form.email}`} className="text-blue-600 hover:underline font-medium">
                  {form.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <a href={`tel:${form.mobileNumber}`} className="text-blue-600 hover:underline font-medium">
                  {form.mobileNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Course Interest</h3>
            
            <div className="flex items-start gap-3">
              <BookOpen className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Course</p>
                <p className="text-slate-900 font-medium">{form.course}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Submitted</p>
                <p className="text-slate-900 font-medium">{formatDate(form.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Message</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 whitespace-pre-wrap">{form.message}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-xl flex gap-3 justify-end border-t">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Submissions Table Component
function SubmissionsTable({ forms, onMarkAsRead, onViewDetails }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {forms.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-600">
                  No submissions yet
                </td>
              </tr>
            ) : (
              forms.map((form) => (
                <tr
                  key={form._id}
                  className={`hover:bg-slate-50 transition duration-150 ${
                    !form.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onViewDetails(form)}
                  >
                    <p className="font-medium text-slate-900">{form.name}</p>
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onViewDetails(form)}
                  >
                    <p className="text-slate-600">{form.email}</p>
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onViewDetails(form)}
                  >
                    <p className="text-slate-600">{form.course}</p>
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onViewDetails(form)}
                  >
                    {form.isRead ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Circle size={12} />
                        Unread
                      </span>
                    )}
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onViewDetails(form)}
                  >
                    <p className="text-slate-600 text-sm">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(form);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        View
                      </button>
                      {!form.isRead && (
                        <>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(form._id);
                            }}
                            className="text-green-600 hover:text-green-800 font-medium text-sm hover:underline"
                          >
                            Mark Read
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function AdminDashboardPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const navigate = useNavigate();

  const fetchForms = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAllForms();
      setForms(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch forms');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markFormAsRead(id);
      setForms((prevForms) =>
        prevForms.map((form) =>
          form._id === id ? { ...form, isRead: true } : form
        )
      );
      // Update selected form if it's the one being marked
      if (selectedForm && selectedForm._id === id) {
        setSelectedForm({ ...selectedForm, isRead: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update form');
    }
  };

  const handleViewDetails = (form) => {
    setSelectedForm(form);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage course inquiries</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading submissions...</p>
          </div>
        ) : (
          <SubmissionsTable
            forms={forms}
            onMarkAsRead={handleMarkAsRead}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {/* Detail Modal */}
      {selectedForm && (
        <FormDetailModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
        />
      )}
    </div>
  );
}