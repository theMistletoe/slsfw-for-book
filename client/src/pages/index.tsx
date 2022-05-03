import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

type Todo = {
  id: string;
  title: string;
  description: string;
};

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/dev/todos?userid=john')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setTodos(data.Items);
    })
  }, []);

  const handleSubmit = () => {
    fetch('http://localhost:3000/dev/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userid": "john", //FIXME 
        "title": todoTitle,
        "description": ""
      })
    }).then((data) => console.log(data));
  }

  return (
    <div>
      <h1>Todo</h1>
      <input type="text" onChange={(e) => setTodoTitle(e.target.value)} />
      <button onClick={handleSubmit}>submit</button>
      <ul>
        {todos.map((todo:Todo) => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  )
}

export default Home

