import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const users = await prisma.user.findMany({
        include: { posts: true }
      });
      res.status(200).json(users);
    } 
    else if (req.method === 'POST') {
      const { name, email } = req.body;
      const user = await prisma.user.create({
        data: { name, email }
      });
      res.status(201).json(user);
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}