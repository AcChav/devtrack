const STATUS_COLORS = {
  Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Interviewing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Offered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

const ApplicationCard = ({ app, onStatusChange, onDelete }) => {
  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-all flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">{app.role_title}</h3>
            <p className="text-slate-300 font-medium text-sm">{app.company_name}</p>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
              STATUS_COLORS[app.status] || 'bg-slate-700 text-slate-300'
            }`}
          >
            {app.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-400 mt-3">
          <span>📍 {app.location || 'Remote'}</span>
          {app.salary && <span>💰 {app.salary}</span>}
          <span>📅 Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
        </div>

        {app.notes && (
          <p className="mt-3 text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
            {app.notes}
          </p>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offered">Offered</option>
          <option value="Rejected">Rejected</option>
        </select>

        <div className="flex items-center gap-3">
          {app.job_url && (
            <a
              href={app.job_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Job Link
            </a>
          )}
          <button
            onClick={() => onDelete(app.id)}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;