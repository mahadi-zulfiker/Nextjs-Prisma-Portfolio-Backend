import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import z from 'zod';
import slugify from 'slugify'; // Install slugify: npm i slugify @types/slugify

const prisma = new PrismaClient();

const blogSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const getAllBlogs = async (_req: Request, res: Response) => {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(blogs);
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = blogSchema.parse(req.body);
    const slug = slugify(title, { lower: true });
    const blog = await prisma.blog.create({ data: { title, slug, content } });
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = blogSchema.parse(req.body);
    const slug = slugify(title, { lower: true });
    const blog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: { title, slug, content },
    });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input or blog not found' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.blog.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
};