

import { client } from "../../index";
import { QueryResult } from "pg";

interface TODO {
    id: number;
    title: string;
    description: string;
    done: boolean;
    // Additional properties if present in your database schema
    // 
}
/*
 * Function should insert a new todo for this user
 * Should return a todo object
 * {
 *  title: string,
 *  description: string,
 *  done: boolean,
 *  id: number
 * }
 */

export async function createTodo(
  userId: number,
  title: string,
  description: string
) {
  const query =
    "INSERT INTO todos (user_id,title,description) VALUES ($1,$2,$3) RETURNING *";
  const result = await client.query(query, [userId, title, description]);
  return result.rows[0];
}

/*
 * mark done as true for this specific todo.
 * Should return a todo object
 * {
 *  title: string,
 *  description: string,
 *  done: boolean,
 *  id: number
 * }
 */


export async function updateTodo(todoId: number) {
  const query = "UPDATE todos SET done=true where id=$1 RETURNING *";
  const result = await client.query(query, [todoId]);
  return result.rows[0];
}
/*
 *  Get all the todos of a given user
 * Should return an array of todos
 * [{
 *  title: string,
 *  description: string,
 *  done: boolean,
 *  id: number
 * }]
 */

export async function getTodos(userId: number) {
  const query = 'SELECT * FROM todos WHERE user_id = $1';
  const values = [userId];
  const result = await client.query(query, values);
  return result.rows;
}
