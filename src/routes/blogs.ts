import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;