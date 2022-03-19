import { useEffect, useState } from 'react'
import './App.css'

type Todo = {
  id: string;
  title: string;
  description: string;
};

const App = () => {
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

export default App
