import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import z from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  title: z.string().min(1, 'Title required'),
  thumbnail: z.string().url('Invalid URL').optional(),
  description: z.string().min(1, 'Description required'),
  features: z.union([
    z.array(z.string().min(1)),
    z.string()
  ]).optional(),
  liveLink: z.string().url('Invalid URL').optional(),
  repoLink: z.string().url('Invalid URL').optional(),
});

// Helper function to ensure features is always an array
function ensureFeaturesArray(features: string | string[] | undefined): string[] {
  if (Array.isArray(features)) {
    return features;
  }
  if (typeof features === 'string') {
    try {
      // Try to parse as JSON array first
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // If not JSON or not an array, split by comma
      return features.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }
  }
  return [];
}

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    console.log("Projects fetched from DB:", projects);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const parsedData = projectSchema.parse(req.body);
    // Ensure features is always an array for Prisma
    const data = {
      ...parsedData,
      features: ensureFeaturesArray(parsedData.features)
    };
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error creating project:", error);
    res.status(500).json({ error: 'Failed to create project', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedData = projectSchema.parse(req.body);
    // Ensure features is always an array for Prisma
    const data = {
      ...parsedData,
      features: ensureFeaturesArray(parsedData.features)
    };
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error updating project:", error);
    res.status(404).json({ error: 'Project not found or invalid input', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(404).json({ error: 'Project not found', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};