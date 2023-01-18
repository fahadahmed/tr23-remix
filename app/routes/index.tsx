import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import React, { useRef, useEffect, MutableRefObject } from "react";
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
  let transition = useTransition();
  let isAdding = 
    transition.state === 'submitting' && 
    transition.submission.formData.get('_action') === 'create';
  let formRef: MutableRefObject<any> = useRef();

  const handleChange = (e: React.BaseSyntheticEvent) => {
    submit(e.currentTarget, { replace: true });
  }

  useEffect(() => {
    if(!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding])

  return (
    <div className="app-container">
      <h1 className="title">Transformation Realised - 2023</h1>
      {todos.length === 0 ? (
        <p className="empty-message">
          There are no todos create yet. Add some using the form below.
        </p>
      ) : null}
      {todos.map((task: Task) => {
        return (
          <div key={task.id} className="todo-container">
            <Form method='post' onChange={handleChange}>
              <input 
                type="checkbox" 
                aria-label="complete task" 
                name="toggle"
                value={task.status} 
                onChange={() => {}} 
                checked={task.status === 'complete'} 
              />
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
              <button 
                type="submit" 
                name="_action" 
                value="delete" 
                className="delete-button"
              >
                x
              </button>
            </Form>
          </div>
        );
      })}
      <Form ref={formRef} method='post' className="create-task-container">
        <input type="text" name="task" placeholder="What do you want to do?" />
        <button 
          type="submit" 
          name="_action" 
          value="create"
        >
          {isAdding ? 'Creating...' : 'Create task'}
        </button>
      </Form>
    </div>
  );
}