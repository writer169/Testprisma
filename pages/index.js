import { useState, useEffect } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/posts')
      ]);
      
      const usersData = await usersRes.json();
      const postsData = await postsRes.json();
      
      setUsers(usersData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    const name = prompt('Имя пользователя:');
    const email = prompt('Email:');
    
    if (!name || !email) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Prisma Test App</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Пользователи</h2>
        <button onClick={createUser} style={{ marginBottom: '10px', padding: '5px 10px' }}>
          Добавить пользователя
        </button>
        {users.length === 0 ? (
          <p>Пользователей нет</p>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2>Посты</h2>
        {posts.length === 0 ? (
          <p>Постов нет</p>
        ) : (
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <strong>{post.title}</strong> - {post.author.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}