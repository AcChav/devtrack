import api from './client';

export const fetchApplications = async () => {
  const response = await api.get('/applications');
  return response.data.applications;
};

export const createApplication = async (applicationData) => {
  const response = await api.post('/applications', applicationData);
  return response.data.application;
};

export const updateApplication = async (id, updateData) => {
  const response = await api.put(`/applications/${id}`, updateData);
  return response.data.application;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};