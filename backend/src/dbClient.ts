import * as pg from 'pg'
import { Generation, UserWithPassword, DbUser } from './types'

const Pool  = pg.Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
})

export const createMissingTables = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30),
      email VARCHAR(30),
      password VARCHAR,
      curr_generation_index INTEGER NOT NULL
    );
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS generations (
      id SERIAL PRIMARY KEY,
      index VARCHAR(30),
      data JSONB,
      password VARCHAR,
      user_id SERIAL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `)
}

export const getGenerationByIndex = async (index: number, userId: string): Promise<Generation | undefined> => {
  const result = await pool.query(
    'SELECT data FROM generations WHERE index = $1 AND user_id = $2',
    [index, userId]
  )
  return result.rows.length > 0
    ? result.rows[0].data
    : undefined
}

export const addGeneration = async (gen: Generation, index: number, userId: string): Promise<void> => {
  await pool.query(
    'INSERT INTO generations (index, data, user_id) VALUES ($1, $2, $3)',
    [index, JSON.stringify(gen), userId]
  )
}

export const clearGenerations = async (userId: string): Promise<void> => {
  await pool.query('DELETE FROM generations WHERE user_id = $1', [userId])
}

export const generationCount = async (userId: string): Promise<number> => {
  const result = await pool.query('SELECT COUNT(data) FROM generations WHERE user_id = $1', [userId])
  return result.rows[0].count
}

export const createUser = async (user: UserWithPassword): Promise<DbUser> => {
  await pool.query('INSERT INTO users (name, email, password, curr_generation_index) VALUES ($1, $2, $3, $4)', [user.name, user.email, user.hashedPassword, 0])
  return getUserByEmail(user.email)
}

export const getUserByEmail = async (email: string): Promise<DbUser> => {
  const result = await pool.query('SELECT id, name, email, password, curr_generation_index FROM users WHERE email = $1', [email])
  return result.rows[0]
}

export const getUserById = async (id: string): Promise<DbUser> => {
  const result = await pool.query('SELECT id, name, email, password, curr_generation_index FROM users WHERE id = $1', [id])
  return result.rows[0]
}

export const setCurrGenerationIdx = async (genIdx: number, userId: string): Promise<void> => {
  await pool.query('UPDATE users SET curr_generation_index = $1 WHERE id = $2', [genIdx, userId])
}