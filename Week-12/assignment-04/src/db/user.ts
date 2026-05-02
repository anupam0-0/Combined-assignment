import { client } from '../index';

export async function createUser(username: string, password: string, name: string) {
    const sqlquery = `INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *`;
    const values = [username, password, name];
    const result = await client.query(sqlquery, values);
    return result.rows[0];
}

export async function getUser(id: number) {
    const sqlquery = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const result = await client.query(sqlquery, values);
    return result.rows[0];
}
  
