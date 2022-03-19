import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './../aws-exports';
Amplify.configure(awsExports);

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
    <div>
      <ul>
        {todos.map((todo:Todo) => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  )
}

export default withAuthenticator(Home)
