import * as pg from 'pg'
import { Generation, User, UserWithPassword } from './types'

const Pool  = pg.Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'game-of-life',
  password: 'password',
  port: 5432,
})

export const getGenerationByIndex = async (index: number): Promise<Generation | undefined> => {
  const result = await pool.query('SELECT data FROM generations WHERE index = $1', [index])
  return result.rows.length > 0
    ? result.rows[0].data
    : undefined
}

export const addGeneration = async (gen: Generation, index: number): Promise<void> => {
  await pool.query('INSERT INTO generations (index, data) VALUES ($1, $2)', [index, JSON.stringify(gen)])
}

export const clearGenerations = async (): Promise<void> => {
  await pool.query('DELETE FROM generations')
}

export const generationCount = async (): Promise<number> => {
  const result = await pool.query('SELECT COUNT(data) FROM generations')
  return result.rows[0].count
}

export const createUser = async (user: UserWithPassword): Promise<User> => {
  await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [user.name, user.email, user.hashedPassword])
  const result = await pool.query('SELECT name, email, password FROM users WHERE email = $1', [user.email])
  return result.rows[0]
}
