import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllForms, markFormAsRead, updateAdminNotes } from '../services/api';
import { 
  LogOut, X, Mail, Phone, User, BookOpen, Calendar, 
  CheckCircle, Circle, Send, Clock, AlertCircle, 
  MessageSquare, Loader2, RefreshCw, Search, ChevronDown, ChevronUp
} from 'lucide-react';

function ConfirmationModal({ isOpen, onClose, onConfirm, form, isLoading }) {
  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slide-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Send className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Mark as Read & Send Email</h3>
              <p className="text-sm text-slate-600">This action will send a thank you email</p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-600 mb-2">A thank you email will be sent to:</p>
            <p className="font-medium text-slate-900">{form.name}</p>
            <p className="text-slate-600">{form.email}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-sm text-amber-800">
                This action can only be performed once. The email will not be sent again if you click this button multiple times.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-800 font-semibold py-2.5 px-4 rounded-lg transition duration-200"
              data-testid="button-cancel-confirm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              data-testid="button-confirm-mark-read"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Confirm & Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Send;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up`}>
      <Icon size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
}

function StatusBadge({ form }) {
  if (form.isRead && form.thankYouEmailSent) {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium" data-testid={`status-badge-${form._id}`}>
        <CheckCircle size={12} />
        Email Sent
      </span>
    );
  }
  if (form.isRead && !form.thankYouEmailSent) {
    return (
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium" data-testid={`status-badge-${form._id}`}>
        <Clock size={12} />
        Read
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-medium" data-testid={`status-badge-${form._id}`}>
      <Circle size={12} />
      Unread
    </span>
  );
}

function FormDetailModal({ form, onClose, onSaveNotes }) {
  const [notes, setNotes] = useState(form?.adminNotes || '');
  const [saving, setSaving] = useState(false);

  if (!form) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    await onSaveNotes(form._id, notes);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">Inquiry Details</h2>
            <p className="text-blue-100 text-sm">ID: {form._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition duration-200"
            data-testid="button-close-modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge form={form} />
            {form.readAt && (
              <span className="text-sm text-slate-500">
                Read on {formatDate(form.readAt)}
              </span>
            )}
            {form.thankYouEmailSentAt && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Mail size={14} />
                Email sent {formatDate(form.thankYouEmailSentAt)}
              </span>
            )}
          </div>

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
              <Clock className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Preferred Contact Time</p>
                <p className="text-slate-900 font-medium">{form.preferredContactTime}</p>
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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-slate-900">Admin Notes</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this inquiry..."
              className="w-full h-24 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              data-testid="input-admin-notes"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
              data-testid="button-save-notes"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                'Save Notes'
              )}
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-xl flex gap-3 justify-end border-t">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            data-testid="button-close-detail"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionsTable({ forms, onMarkAsRead, onViewDetails, processingId, sortConfig, onSort }) {
  const SortableHeader = ({ column, label }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortConfig.key === column && (
          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <tr>
              <SortableHeader column="name" label="Name" />
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <SortableHeader column="createdAt" label="Date" />
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {forms.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="text-slate-400" size={32} />
                    </div>
                    <p className="text-slate-600 font-medium mb-1">No submissions found</p>
                    <p className="text-slate-500 text-sm">New course inquiries will appear here</p>
                  </div>
                </td>
              </tr>
            ) : (
              forms.map((form, index) => (
                <tr
                  key={form._id}
                  className={`transition-all duration-200 hover:shadow-sm ${
                    !form.isRead 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : index % 2 === 0 
                        ? 'bg-white hover:bg-slate-50' 
                        : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  data-testid={`row-submission-${form._id}`}
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
                  <td className="px-6 py-4">
                    <StatusBadge form={form} />
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
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition"
                        data-testid={`button-view-${form._id}`}
                      >
                        View
                      </button>
                      {!form.isRead && (
                        <>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(form);
                            }}
                            disabled={processingId === form._id}
                            className="text-green-600 hover:text-green-800 disabled:text-green-400 font-medium text-sm hover:underline flex items-center gap-1 transition"
                            data-testid={`button-mark-read-${form._id}`}
                          >
                            {processingId === form._id ? (
                              <>
                                <Loader2 className="animate-spin" size={14} />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Send size={14} />
                                Mark Read
                              </>
                            )}
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

export default function AdminDashboardPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [confirmForm, setConfirmForm] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
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

  const handleMarkAsReadClick = (form) => {
    setConfirmForm(form);
  };

  const handleConfirmMarkAsRead = async () => {
    if (!confirmForm) return;
    
    setProcessingId(confirmForm._id);
    
    try {
      const response = await markFormAsRead(confirmForm._id);
      const { data, emailSent, alreadyProcessed, emailError } = response.data;
      
      setForms((prevForms) =>
        prevForms.map((form) =>
          form._id === confirmForm._id ? data : form
        )
      );
      
      if (selectedForm && selectedForm._id === confirmForm._id) {
        setSelectedForm(data);
      }

      if (alreadyProcessed) {
        setToast({ message: 'This submission was already processed', type: 'info' });
      } else if (emailSent) {
        setToast({ message: 'Marked as read and thank you email sent successfully!', type: 'success' });
      } else if (emailError) {
        setToast({ message: `Marked as read but email failed: ${emailError}`, type: 'error' });
      } else {
        setToast({ message: 'Marked as read (email was already sent)', type: 'success' });
      }
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to process submission', 
        type: 'error' 
      });
    } finally {
      setProcessingId(null);
      setConfirmForm(null);
    }
  };

  const handleSaveNotes = async (id, notes) => {
    try {
      const response = await updateAdminNotes(id, notes);
      setForms((prevForms) =>
        prevForms.map((form) =>
          form._id === id ? response.data.data : form
        )
      );
      setToast({ message: 'Notes saved successfully', type: 'success' });
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to save notes', 
        type: 'error' 
      });
    }
  };

  const handleViewDetails = (form) => {
    setSelectedForm(form);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and search logic
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !form.isRead) ||
                         (filterStatus === 'read' && form.isRead && !form.thankYouEmailSent) ||
                         (filterStatus === 'emailSent' && form.thankYouEmailSent);
    
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedForms = [...filteredForms].sort((a, b) => {
    if (sortConfig.key === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const stats = {
    total: forms.length,
    unread: forms.filter(f => !f.isRead).length,
    read: forms.filter(f => f.isRead && !f.thankYouEmailSent).length,
    emailSent: forms.filter(f => f.thankYouEmailSent).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1" data-testid="text-dashboard-title">Admin Dashboard</h1>
            <p className="text-slate-600">Manage course inquiries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchForms}
              disabled={loading}
              className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              data-testid="button-refresh"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              data-testid="button-logout"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Total</p>
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-slate-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900" data-testid="stat-total">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">All submissions</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-yellow-700">Unread</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Circle className="text-yellow-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-800" data-testid="stat-unread">{stats.unread}</p>
            <p className="text-xs text-yellow-600 mt-1">Need attention</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Read</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-800" data-testid="stat-read">{stats.read}</p>
            <p className="text-xs text-blue-600 mt-1">Awaiting email</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700">Email Sent</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-800" data-testid="stat-email-sent">{stats.emailSent}</p>
            <p className="text-xs text-green-600 mt-1">Completed</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slide-up">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-800" data-testid="text-error">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2.5 rounded-lg font-medium transition ${
                  filterStatus === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus('unread')}
                className={`px-4 py-2.5 rounded-lg font-medium transition ${
                  filterStatus === 'unread' 
                    ? 'bg-yellow-600 text-white shadow-md' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Unread ({stats.unread})
              </button>
              <button
                onClick={() => setFilterStatus('read')}
                className={`px-4 py-2.5 rounded-lg font-medium transition ${
                  filterStatus === 'read' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Read ({stats.read})
              </button>
              <button
                onClick={() => setFilterStatus('emailSent')}
                className={`px-4 py-2.5 rounded-lg font-medium transition ${
                  filterStatus === 'emailSent' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Completed ({stats.emailSent})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-slate-600 font-medium text-lg">Loading submissions...</p>
            <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
          </div>
        ) : (
          <SubmissionsTable
            forms={sortedForms}
            onMarkAsRead={handleMarkAsReadClick}
            onViewDetails={handleViewDetails}
            processingId={processingId}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>

      {selectedForm && (
        <FormDetailModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
          onSaveNotes={handleSaveNotes}
        />
      )}

      <ConfirmationModal
        isOpen={!!confirmForm}
        form={confirmForm}
        onClose={() => setConfirmForm(null)}
        onConfirm={handleConfirmMarkAsRead}
        isLoading={!!processingId}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}