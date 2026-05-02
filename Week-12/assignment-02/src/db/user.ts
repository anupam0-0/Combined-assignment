import { client } from "..";
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
    name: string
  ) {
    const sqlquery = "insert into users (username, password, name) values ($1, $2, $3) returning *"
    const res = await client.query(sqlquery, [username, password, name])
    return res.rows[0]
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
  const sqlquery = "select * from users where id = $1";
  const res = await client.query(sqlquery, [userId]);
  return res.rows[0]

}

