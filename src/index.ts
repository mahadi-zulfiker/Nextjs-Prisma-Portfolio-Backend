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

app.use(cors({ origin: 'http://localhost:3000' })); // Update for production
app.use(express.json());

// Seed admin on start (for dev; remove or secure for prod)
seedAdmin(prisma);

// Routes
app.use('/', (req, res) => {
  res.send("Welcome to the Portfolio API");
});
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});