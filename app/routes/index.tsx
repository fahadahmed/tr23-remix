import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import React, { useState} from "react";
import { getTodos, addTodo, deleteTodo, toggleCompletion } from "~/api/todos";
import styles from '../styles/global.css';

type Task = {
  id: number;
  description: string;
  status: string;
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export async function loader({ request }: LoaderArgs) {
  const todos = await getTodos();
  return json({ todos });
}

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let { _action, toggle, status, ...values } = Object.fromEntries(formData);
  console.log(_action, values);

  if (_action === 'create') {
    await addTodo(values.task as string);
  }
  if (_action === 'delete') {
    await deleteTodo(JSON.parse(values.task as any));
  }

  if (_action === 'status') {
    await toggleCompletion(JSON.parse(values.task as any));

  }
  return null;
}
export default function Index() {
  const { todos } = useLoaderData();
  const submit = useSubmit();
  const [status, setStatus] = useState('incomplete');

  const handleChange = (e: React.BaseSyntheticEvent) => {
    submit(e.currentTarget, { replace: true });
  }

  const toggleTask = (task: any) => {
    setStatus(prevState => prevState === 'incomplete' ? 'complete' : 'incomplete');
  }

  return (
    <div className="app-container">
      <h1 className="title">Transformation Realised - 2023</h1>
      {todos.map((task: Task) => {
        return (
          <div key={task.id} style={{ display: 'flex' }}>
            <Form method='post' onChange={handleChange}>
              <input type="checkbox" name="toggle" value={task.status} onChange={toggleTask} checked={task.status === 'complete'} />
              <input type="hidden" name="task" value={JSON.stringify(task)} />
              <input type="hidden" name="_action" value="status" />
              <span>{task.description}</span>
            </Form>
            <Form method="post">
              <input type="hidden" name="task" value={JSON.stringify(task)} />
              <button type="submit" name="_action" value="delete">x</button>
            </Form>
          </div>
        );
      })}
      <Form method='post'>
        <input type="text" name="task" placeholder="What do you want to do?" />
        <button type="submit" name="_action" value="create">Create task</button>
      </Form>
    </div>
  );
}