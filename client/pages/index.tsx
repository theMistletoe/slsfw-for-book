import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

type Todo = {
  id: string;
  title: string;
  description: string;
};

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/dev/todos?userid=john')
    .then((res) => res.json())
    .then((data) => {
      setTodos(data.Items);
    })
  }, []);

  return (
    <ul>
      {todos.map((todo:Todo) => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  )
}

export default Home
