import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import React from "react";
import { getTodos, addTodo, deleteTodo, toggleCompletion } from "~/api/todos";
import styles from '../styles/global.css';

type Task = {
  id: number;
  description: string;
  status: string;
}

export function meta() {
  return {
    title: 'Transformation Realised 2023 - Demo',
    description: 'A introduction to Remix as a fullstack framework'
  }
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
  let { _action, ...values } = Object.fromEntries(formData);
  let res;
  if (_action === 'create') {
    res = await addTodo(values.task as string);
  }
  if (_action === 'delete') {
    res = await deleteTodo(JSON.parse(values.task as any));
  }

  if (_action === 'status') {
    res = await toggleCompletion(JSON.parse(values.task as any));

  }
  return res;
}
export default function Index() {
  const { todos } = useLoaderData();
  const submit = useSubmit();

  const handleChange = (e: React.BaseSyntheticEvent) => {
    submit(e.currentTarget, { replace: true });
  }

  return (
    <div className="app-container">
      <h1 className="title">Transformation Realised - 2023</h1>
      {todos.map((task: Task) => {
        return (
          <div key={task.id} className="todo-container">
            <Form method='post' onChange={handleChange}>
              <input type="checkbox" aria-label="complete task" name="toggle" value={task.status} onChange={() => {}} checked={task.status === 'complete'} />
              <input type="hidden" name="task" value={JSON.stringify(task)} />
              <input type="hidden" name="_action" value="status" />
            </Form>
            <span>{ task.status === 'complete' ? (
                <s>{task.description}</s>
              ) :
                task.description
              }</span>
            <Form method="post">
              <input type="hidden" name="task" value={JSON.stringify(task)} />
              <button type="submit" name="_action" value="delete" className="delete-button">x</button>
            </Form>
          </div>
        );
      })}
      <Form method='post' className="create-task-container">
        <input type="text" name="task" placeholder="What do you want to do?" />
        <button type="submit" name="_action" value="create">Create task</button>
      </Form>
    </div>
  );
}