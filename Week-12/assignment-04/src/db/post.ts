import { client } from '../index';

export async function createPost(userId: number, content: string) {
    const sqlquery = `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`;
    const values = [userId, content];
    const result = await client.query(sqlquery, values);
    return result.rows[0];
}

export async function likePost(userId: number, postId: number) {
    const sqlquery = `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *`;
    const values = [userId, postId];
    const result = await client.query(sqlquery, values);
    return result.rows[0];
}

export async function getFeed() {
    const sqlquery = `SELECT posts.content, posts.created_at, users.username, count(likes.post_id) as like_count FROM posts 
        JOIN users ON posts.user_id = users.id 
        LEFT JOIN likes ON posts.id = likes.post_id 
        GROUP BY posts.id, users.username, posts.content, posts.created_at 
        ORDER BY posts.created_at DESC`;
    const result = await client.query(sqlquery);
    return result.rows;
}

