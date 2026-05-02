import { client } from "../index";

interface TODO {
    id: number;
    title: string;
    description: string;
    done: boolean;
    user_id: number;
}

/*
 * Function should insert a new todo for this user
 * Should return a todo object
 */
export async function createTodo(
    userId: number,
    title: string,
    description: string,
): Promise<TODO> {
    const query =
        "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *";
    const result = await client.query(query, [userId, title, description]);
    return result.rows[0];
}

/*
 * mark done as true for this specific todo.
 * Should return a todo object
 */
export async function updateTodo(todoId: number): Promise<TODO> {
    const query = "UPDATE todos SET done = true WHERE id = $1 RETURNING *";
    const result = await client.query(query, [todoId]);
    return result.rows[0];
}

/*
 *  Get all the todos of a given user
 * Should return an array of todos
 */
export async function getTodos(userId: number): Promise<TODO[]> {
    const query = "SELECT * FROM todos WHERE user_id = $1";
    const result = await client.query(query, [userId]);
    return result.rows;
}
