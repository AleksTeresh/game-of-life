import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import * as cors from 'cors'
import {
  getGenerationByIndex,
  addGeneration,
  clearGenerations,
  generationCount
} from './dbClient'
import { Generation } from 'types'

const app = express()

app.use(cors())

const schema = buildSchema(`
  type Query {
    currGeneration: [[Cell!]!]!
  }

  type Mutation {
    nextGeneration: [[Cell!]!]!
    prevGeneration: [[Cell!]!]!
  }

  type Cell {
    alive: Boolean!
  }
`)

let currGenIdx = 0

const root = {
  currGeneration: async () => {
    const result = await getGenerationByIndex(currGenIdx)
    return result
  },
  nextGeneration: async () => {
    const genCount = await generationCount()
    if (currGenIdx + 1 >= genCount) {
      const lastGeneration = await getGenerationByIndex(genCount - 1)
      await addGeneration(createNewGeneration(lastGeneration), genCount)
    }
    currGenIdx++
    return getGenerationByIndex(currGenIdx)
  },
  prevGeneration: async () => {
    currGenIdx = Math.max(0, currGenIdx - 1)
    return getGenerationByIndex(currGenIdx)
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

clearGenerations()
  .then(() => addGeneration(createNewGeneration(), 0))
  .then(() => console.log('Listening on port 3000...'))

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
