import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import z from 'zod';
import slugify from 'slugify';

const prisma = new PrismaClient();

const blogSchema = z.object({
  title: z.string().min(1, 'Title required'),
  content: z.string().min(1, 'Content required'),
});

export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { slug } });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = blogSchema.parse(req.body);
    const slug = slugify(title, { lower: true });
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const blog = await prisma.blog.create({ data: { title, slug, content } });
    res.status(201).json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = blogSchema.parse(req.body);
    const slug = slugify(title, { lower: true });
    const existing = await prisma.blog.findFirst({ where: { slug, id: { not: parseInt(id) } } });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const blog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: { title, slug, content },
    });
    res.json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(404).json({ error: 'Blog not found or invalid input' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.blog.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Blog not found' });
  }
};