import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import z from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  title: z.string().min(1),
  thumbnail: z.string().url().optional(),
  description: z.string().min(1),
  features: z.array(z.string()),
  liveLink: z.string().url().optional(),
  repoLink: z.string().url().optional(),
});

export const getAllProjects = async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(projects);
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
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
    res.status(400).json({ error: 'Invalid input or project not found' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
};