import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import {
  getGenerationByIndex,
  addGeneration,
  generationCount,
  createUser,
  getUserByEmail,
  getUserById,
  setCurrGenerationIdx
} from './dbClient'
import { Generation, AuthResponse } from './types'
import { SECRET, getUserId } from './util'

const app = express()

app.use(cors())

const schema = buildSchema(`
  type Query {
    currGeneration: [[Cell!]!]!
  }

  type Mutation {
    nextGeneration: [[Cell!]!]!
    prevGeneration: [[Cell!]!]!
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }

  type Cell {
    alive: Boolean!
  }

  type AuthPayload {
    token: String
    user: User
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }
`)

const root = {
  currGeneration: async (_args, request): Promise<Generation> => {
    const userId = getUserId(request)
    const user = await getUserById(userId)
    const result = await getGenerationByIndex(user.curr_generation_index, userId)
    console.log(user.curr_generation_index)
    if (!result) {
      throw new Error('Something went wrong. No current generation found')
    }

    return result
  },
  nextGeneration: async (_args, request): Promise<Generation> => {
    const userId = getUserId(request)
    const genCount = await generationCount(userId)
    const user = await getUserById(userId)
    if (user.curr_generation_index + 1 >= genCount) {
      const lastGeneration = await getGenerationByIndex(genCount - 1, userId)
      await addGeneration(createNewGeneration(lastGeneration), genCount, userId)
    }

    const nextGenIdx = user.curr_generation_index + 1
    await setCurrGenerationIdx(nextGenIdx, user.id)

    const nextGeneration = await getGenerationByIndex(nextGenIdx, userId)
    if (!nextGeneration) {
      throw new Error('Something went wrong. Cannot get next generation')
    }

    return nextGeneration
  },
  prevGeneration: async (_args, request): Promise<Generation> => {
    const userId = getUserId(request)
    const user = await getUserById(userId)
    const prevGenIdx = Math.max(0, user.curr_generation_index - 1)

    await setCurrGenerationIdx(prevGenIdx, user.id)
    const prevGeneration = await getGenerationByIndex(prevGenIdx, userId)
    if (!prevGeneration) {
      throw new Error('Something went wrong. Cannot get previous generation')
    }

    return prevGeneration
  },
  signup: async (args: { email: string, password: string, name: string }): Promise<AuthResponse> => {
    const hashedPassword = await bcrypt.hash(args.password, 10)
    const userWithPassword = await createUser({ ...args, hashedPassword })
    const token = jwt.sign({ userId: userWithPassword.id }, SECRET)

    await addGeneration(createNewGeneration(), 0, userWithPassword.id)

    return {
      token,
      user: {
        id: userWithPassword.id,
        name: userWithPassword.name,
        email: userWithPassword.email,
      }
    }
  },
  login: async (args: { email: string, password: string }): Promise<AuthResponse> => {
    const userWithPassword = await getUserByEmail(args.email)
    if (!userWithPassword) {
      throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, userWithPassword.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: userWithPassword.id }, SECRET)

    return {
      token,
      user: {
        id: userWithPassword.id,
        name: userWithPassword.name,
        email: userWithPassword.email,
      }
    }
  }
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
)

app.listen(3000)
console.log('Listening on port 3000...')

function createNewGeneration(currState?: Generation): Generation {
  if (!currState) {
    return getDefaultState()
  }

  const padded = [
    Array(currState[0].length + 2).fill(0).map(() => ({ alive: false })),
    ...currState.map(row => [{ alive: false }, ...row, { alive: false }]),
    Array(currState[0].length + 2).fill(0).map(() => ({ alive: false }))
  ]

  const nextGenPadded = padded.map((row, rowIdx) => row.map((cell, columnIdx) => {
    if (rowIdx === 0 || rowIdx === padded.length - 1 || columnIdx === 0 || columnIdx === padded[0].length - 1) {
      return cell
    }

    const count = countNeighbors(padded, rowIdx, columnIdx)
    if (cell.alive) {
      return { alive: (count === 2 || count === 3) }
    } else {
      return { alive: count === 3 }
    }
  }))

  return nextGenPadded
    .slice(1, nextGenPadded.length - 1)
    .map(row => row.slice(1, row.length - 1))
}

function getDefaultState(): Generation {
  return Array(100).fill(0)
    .map(() => (
      Array(100).fill(0)
        .map(() => ({ alive: (Math.random() < 0.2) }))
    ))
}

function countNeighbors(cells: Generation, rowIdx: number, columnIdx: number): number {
  return (cells[rowIdx - 1][columnIdx - 1].alive ? 1 : 0) +
    (cells[rowIdx - 1][columnIdx].alive ? 1 : 0) +
    (cells[rowIdx - 1][columnIdx + 1].alive ? 1 : 0) +
    (cells[rowIdx][columnIdx - 1].alive ? 1 : 0) +
    (cells[rowIdx][columnIdx + 1].alive ? 1 : 0) +
    (cells[rowIdx + 1][columnIdx - 1].alive ? 1 : 0) +
    (cells[rowIdx + 1][columnIdx].alive ? 1 : 0) +
    (cells[rowIdx + 1][columnIdx + 1].alive ? 1 : 0)
}
