import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export const seedAdmin = async (prisma: PrismaClient) => {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const adminEmail = 'admin@example.com';
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: { email: adminEmail, password: hashedPassword },
    });
    console.log('Admin user seeded');
  } else {
    console.log('Users already exist, skipping seed');
  }
};