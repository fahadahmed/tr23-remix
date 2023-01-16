import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import React from "react";
import { getTodos, addTodo, deleteTodo, toggleCompletion } from "~/api/todos";

type Task = {
  id: number;
  description: string;
  status: string;
}
export async function loader({ request }: LoaderArgs) {
  const todos = await getTodos();
  return json({ todos });
}

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);
  console.log(_action, values);

  if (_action === 'create') {
    await addTodo(values.task as string);
  }
  if (_action === 'delete') {
    await deleteTodo(JSON.parse(values.task as any));
  }

  if (_action === 'complete' || _action === 'incomplete') {
    console.log('We are in this loop', values);
    await toggleCompletion(JSON.parse(values.task as any));

  }
  return null;
}
export default function Index() {
  const { todos } = useLoaderData();
  const submit = useSubmit();

  const handleChange = (e: React.BaseSyntheticEvent) => {
    submit(e.currentTarget, { replace: true });
  }


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Transformation Realised - 2023</h1>
      {todos.map((task: Task) => (
        <div key={task.id} style={{ display: 'flex' }}>
          <Form method='post' onChange={handleChange}>
            <input type="checkbox" name="toggle" value={task.status === 'complete' ? 'complete' : 'incomplete'} defaultChecked={task.status === 'complete'} />
            <input type="hidden" name="task" value={JSON.stringify(task)} />
            <span>{task.description}</span>
          </Form>
          <Form method="post">
            <input type="hidden" name="task" value={JSON.stringify(task)} />
            <button type="submit" name="_action" value="delete">x</button>
          </Form>
        </div>
      ))}
      <Form method='post'>
        <input type="text" name="task" placeholder="What do you want to do?" />
        <button type="submit" name="_action" value="create">Create task</button>
      </Form>
    </div>
  );
}