import { json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

type Task = {
  id: number;
  description: string;
  status: string;
}
export async function loader({request}: LoaderArgs) {
  const todos = [
    {
      id: 1,
      description: 'Learn Remix',
      status: 'incomplete'
    },
    {
      id: 2,
      description: "Learn about Web Fundamentals for Remix",
      status: 'incomplete'
    },
    {
      id: 3,
      description: 'Facilitate Transformation Realised 23 - Remix Session',
      status: 'incomplete'
    }
  ]

  return json({ todos });
}
export default function Index() {

  const { todos } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      {todos.map((task: Task) => (
        <li key={task.id}>{task.description}</li>
      ))}
      <Form method='post'>
        <input type="text" name="task" placeholder="What do you want to do?" />
        <button type="submit">Create task</button>
      </Form>
    </div>
  );
}
