import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export const seedAdmin = async (prisma: PrismaClient) => {
  const adminEmail = 'admin@example.com';
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: { email: adminEmail, password: hashedPassword },
    });
    console.log('Admin user seeded');
  }
};