import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const posts = await prisma.post.findMany({
        include: { author: true }
      });
      res.status(200).json(posts);
    }
    else if (req.method === 'POST') {
      const { title, content, authorId } = req.body;
      const post = await prisma.post.create({
        data: { title, content, authorId: parseInt(authorId) },
        include: { author: true }
      });
      res.status(201).json(post);
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}