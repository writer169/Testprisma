import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Проверяем, есть ли уже данные
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      return res.status(200).json({ 
        message: 'Database already has data',
        users: existingUsers
      });
    }

    // Создаем тестовых пользователей
    const user1 = await prisma.user.create({
      data: {
        name: 'Алексей',
        email: 'alex@example.com',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Мария',
        email: 'maria@example.com',
      },
    });

    // Создаем тестовые посты
    await prisma.post.create({
      data: {
        title: 'Первый пост',
        content: 'Содержимое первого поста',
        published: true,
        authorId: user1.id,
      },
    });

    await prisma.post.create({
      data: {
        title: 'Второй пост',
        content: 'Содержимое второго поста',
        published: false,
        authorId: user2.id,
      },
    });

    res.status(200).json({ 
      message: 'Database setup completed successfully',
      created: {
        users: 2,
        posts: 2
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      error: 'Setup failed', 
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}