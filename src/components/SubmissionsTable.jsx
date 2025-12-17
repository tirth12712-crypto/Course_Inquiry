import { Check } from 'lucide-react';

export default function SubmissionsTable({ forms, onMarkAsRead }) {
  if (forms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-600">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Contact Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr
                key={form._id}
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 text-sm text-slate-900">{form.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{form.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {form.mobileNumber}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {form.course}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {form.preferredContactTime}
                </td>
                <td className="px-6 py-4 text-sm">
                  {form.isRead ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      <Check size={14} />
                      Read
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Unread
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {!form.isRead && (
                    <button
                      onClick={() => onMarkAsRead(form._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg text-xs transition duration-200"
                    >
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
