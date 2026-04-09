import { Router } from 'express';
import { authenticate, isOrganizer, isOrgAdmin } from '../middleware/auth';
import {
  listTeamMembers,
  createTeamMember,
  updateTeamMember,
  resetTeamMemberPassword,
  deleteTeamMember,
  getOrganization,
  addCustomRole,
  deleteCustomRole,
} from '../controllers/userManagementController';

const router = Router();

// All routes require an authenticated organizer admin
router.use(authenticate, isOrganizer, isOrgAdmin);

// Organization & custom roles (mounted before /team/:id so they don't collide)
router.get('/team/organization', getOrganization);
router.post('/team/custom-roles', addCustomRole);
router.delete('/team/custom-roles/:label', deleteCustomRole);

// Team member CRUD
router.get('/team', listTeamMembers);
router.post('/team', createTeamMember);
router.put('/team/:id', updateTeamMember);
router.patch('/team/:id/password', resetTeamMemberPassword);
router.delete('/team/:id', deleteTeamMember);

export default router;
