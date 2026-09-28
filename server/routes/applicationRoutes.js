import { Router } from 'express';
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication
} from '../controllers/applicationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

// These must be '/' and '/:id', NOT '/applications'
router.get('/', getApplications);
router.post('/', addApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;