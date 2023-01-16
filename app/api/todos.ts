import { db } from '~/utils/firebase.server';

const getTodos = async () => {
  const snapshot = await db.collection('todos').get();
  const todos: any = [];

  snapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() });
  });

  return todos;
};

export { getTodos };
