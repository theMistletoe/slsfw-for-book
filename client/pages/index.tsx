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
    fetch('https://d8frx5ocdj.execute-api.us-east-1.amazonaws.com/dev/todos?userid=john')
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
