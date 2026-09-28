import {
  findOrCreateCompany,
  getApplicationsByUserId,
  createApplication,
  updateApplicationById,
  deleteApplicationById
} from '../models/applicationModel.js';

export const getApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByUserId(req.user.userId);
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

export const addApplication = async (req, res) => {
  try {
    const { companyName, roleTitle, jobUrl, location, salary, status, appliedAt, notes } = req.body;

    if (!companyName || !roleTitle) {
      return res.status(400).json({ message: 'Company name and Role title are required' });
    }

    const companyId = await findOrCreateCompany(companyName.trim());

    const newApp = await createApplication({
      userId: req.user.userId,
      companyId,
      roleTitle: roleTitle.trim(),
      jobUrl,
      location,
      salary,
      status,
      appliedAt,
      notes
    });

    res.status(201).json({
      message: 'Application added successfully',
      application: { ...newApp, company_name: companyName }
    });
  } catch (error) {
    console.error('Add application error:', error);
    res.status(500).json({ message: 'Failed to add application' });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateApplicationById(id, req.user.userId, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    res.status(200).json({ message: 'Application updated', application: updated });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteApplicationById(id, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};