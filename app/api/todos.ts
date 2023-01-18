import { db } from '~/utils/firebase.server';

const getTodos = async () => {
  const snapshot = await db.collection('todos').get();
  const todos: any = [];

  snapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() });
  });

  return todos;
};

const addTodo = async (task: string) => {
  try {
    const res = await db.collection('todos').add({
      description: task,
      status: 'incomplete',
    });
    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};

const deleteTodo = async (todo: any) => {
  try {
    const res = await db.collection('todos').doc(todo.id).delete();
    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};

const toggleCompletion = async (todo: any) => {
  try {
    const res = await db
      .collection('todos')
      .doc(todo.id)
      .set({
        description: todo.description,
        status: todo.status === 'complete' ? 'incomplete' : 'complete',
      });
    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};

export { getTodos, addTodo, deleteTodo, toggleCompletion };
