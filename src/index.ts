import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import blogRoutes from './routes/blogs';
import projectRoutes from './routes/projects';
import { seedAdmin } from './utils/seed';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://nextjs-prisma-portfolio-frontend.vercel.app'],
  credentials: true
})); // Update for prod with your domain
app.use(express.json());

// Seed admin if no users exist
seedAdmin(prisma);

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to the Portfolio API");
});
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});