import { pool } from '../db.js';
import { randomUUID } from 'crypto';
import { emitEvent } from '../socket.js';

/* Get All Ideas */
export const getIdeas = async (_, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM ideas ORDER BY vote_count DESC"
    );

    res
      .status(200)
      .set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
      })
      .json(rows);
  } catch (error) {
    console.error('GET IDEAS ERROR:', error);
    res.status(500).json({ message: 'Failed to load ideas' });
  }
};

/* Create Idea */
export const createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO ideas (id, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [randomUUID(), title, description]
    );

    const newIdea = rows[0];

    emitEvent('idea-added', newIdea); 

    res.status(201).json(newIdea);
  } catch (error) {
    console.error('CREATE IDEA ERROR:', error);
    res.status(500).json({ message: 'Failed to create idea' });
  }
};

/* UP vote */
export const upvoteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `UPDATE ideas
       SET vote_count = vote_count + 1
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    emitEvent('idea-updated', rows[0]);

    res.json(rows[0]);
  } catch (error) {
    console.error('UPVOTE ERROR:', error);
    res.status(500).json({ message: 'Failed to upvote idea' });
  }
};

/* DOWN vote */
export const downvoteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `UPDATE ideas
       SET vote_count = vote_count - 1
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    emitEvent('idea-updated', rows[0]);

    res.json(rows[0]);
  } catch (error) {
    console.error('DOWNVOTE ERROR:', error);
    res.status(500).json({ message: 'Failed to downvote idea' });
  }
};
