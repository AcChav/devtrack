import { useState, useEffect, useCallback } from 'react';
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from '../api/applicationApi';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const addApplication = async (appData) => {
    try {
      const newApp = await createApplication(appData);
      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create application.');
    }
  };

  const editApplication = async (id, updates) => {
    try {
      const updated = await updateApplication(id, updates);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...updated } : app))
      );
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update application.');
    }
  };

  const removeApplication = async (id) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete application.');
    }
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    editApplication,
    removeApplication,
    refresh: loadApplications
  };
};

export default useApplications;