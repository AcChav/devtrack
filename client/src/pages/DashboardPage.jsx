import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useApplications from '../hooks/useApplications';
import ApplicationCard from '../components/applications/ApplicationCard';
import ApplicationFormModal from '../components/applications/ApplicationFormModal';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { applications, loading, error, addApplication, editApplication, removeApplication } = useApplications();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status metrics calculation using ES6 reduce
  const metrics = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    { Applied: 0, Interviewing: 0, Offered: 0, Rejected: 0 }
  );

  // Filter applications by search keyword and status dropdown
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    editApplication(id, { status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      removeApplication(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white tracking-tight">DevTrack</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline">{user?.email}</span>
            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Applied</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{metrics.Applied}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Interviewing</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{metrics.Interviewing}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Offers</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.Offered}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Rejected</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{metrics.Rejected}</p>
          </div>
        </div>

        {/* Toolbar: Search, Filter, and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
          <div className="flex flex-1 items-center gap-3">
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span> Add Application
          </button>
        </div>

        {/* Content State Handling */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-800/30">
            <p className="text-slate-400 text-sm">No applications found.</p>
            <p className="text-slate-500 text-xs mt-1">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filters.'
                : 'Click "+ Add Application" above to track your first job.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Application Creation Modal */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addApplication}
      />
    </div>
  );
};

export default DashboardPage;