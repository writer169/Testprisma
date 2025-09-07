const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
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

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });