import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import z from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  title: z.string().min(1, 'Title required'),
  thumbnail: z.string().url('Invalid URL').optional(),
  description: z.string().min(1, 'Description required'),
  features: z.array(z.string().min(1)),
  liveLink: z.string().url('Invalid URL').optional(),
  repoLink: z.string().url('Invalid URL').optional(),
});

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(404).json({ error: 'Project not found or invalid input' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
};