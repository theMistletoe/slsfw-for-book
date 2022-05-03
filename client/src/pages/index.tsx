import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

type Todo = {
  todoId: string;
  title: string;
  description: string;
};

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');

  const fetchTodos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT_URL}/dev/todos?userid=john`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setTodos(data.Items);
    })
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT_URL}/dev/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userid": "john", //FIXME 
        "title": todoTitle,
        "description": ""
      })
    }).then((data) => {
      console.log(data);
      setTodoTitle('');
      fetchTodos();
    });
  }

  return (
    <div>
      <h1>Todo</h1>
      <input type="text" onChange={(e) => setTodoTitle(e.target.value)} />
      <button onClick={handleSubmit}>submit</button>
      <ul>
        {todos.map((todo:Todo) => <li key={todo.todoId}>{todo.title}</li>)}
      </ul>
    </div>
  )
}

export default Home

