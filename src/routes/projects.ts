import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getAllProjects, createProject, updateProject, deleteProject } from '../controllers/projectController';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;