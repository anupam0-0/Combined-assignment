import { client } from "../index";

/*
 * Should insert into the users table
 * Should return the User object
 * {
 *   username: string,
 *   password: string,
 *   name: string
 * }
 */

export async function createUser(
    username: string,
    password: string,
    name: string,
) {
    // const new_todo = await client.query(`
    //     insert into  users (username, password, name) values (
    //     username, password, name

    // `);
    const res = await client.query(`
        insert into users (username, password, name) values ($1, $2, $3) returning *
    `, [username, password, name]);
    return res.rows[0];
}

/*
 * Should return the User object
 * {
 *   username: string,
 *   password: string,
 *   name: string
 * }
 */

export async function getUser(userId: number) {
    const user = await client.query(`
        select * from users where id = $1    
    `, [userId])
    return user.rows[0];
}
