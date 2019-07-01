import React, { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import { CellProps } from './components/Cell';

export default function App() {
  const [gens, setGens] = useState([createNewGeneration()])
  const [currGenIdx, setCurrGenIdx] = useState(0)

  const evenHandler = (e: any) => {
    if (e.keyCode === 13) { // if Enter
      if (currGenIdx + 1 >= gens.length) {
        setGens([
          ...gens,
          createNewGeneration(gens[gens.length - 1])
        ])
      }
      setCurrGenIdx(currGenIdx + 1)
    } else if (e.keyCode === 32) { // space
      setCurrGenIdx(Math.max(0, currGenIdx - 1))
    }
  }

  useEffect(() => {  
    window.addEventListener("keypress", evenHandler, false)
    return () => {
      window.removeEventListener("keypress", evenHandler, false)
    }
  })

  return (
    <div className="App">
      <Board cells={
        gens[currGenIdx]
      } />
    </div>
  );
}

function createNewGeneration(currState?: CellProps[][]) {
  if (!currState) {
    return getDefaultState()
  }

  const padded = [
    Array(currState[0].length + 2).fill(0).map(p => ({ alive: false })),
    ...currState.map(row => [{ alive: false }, ...row, { alive: false }]),
    Array(currState[0].length + 2).fill(0).map(p => ({ alive: false }))
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

function getDefaultState() {
  return Array(100).fill(0)
    .map(row => (
      Array(100).fill(0)
        .map(cell => ({ alive: (Math.random() < 0.2) }))
    ))
}

function countNeighbors(cells: CellProps[][], rowIdx: number, columnIdx: number) {
  return (cells[rowIdx - 1][columnIdx - 1].alive ? 1 : 0) +
    (cells[rowIdx - 1][columnIdx].alive ? 1 : 0) +
    (cells[rowIdx - 1][columnIdx + 1].alive ? 1 : 0) +
    (cells[rowIdx][columnIdx - 1].alive ? 1 : 0) +
    (cells[rowIdx][columnIdx + 1].alive ? 1 : 0) +
    (cells[rowIdx + 1][columnIdx - 1].alive ? 1 : 0) +
    (cells[rowIdx + 1][columnIdx].alive ? 1 : 0) +
    (cells[rowIdx + 1][columnIdx + 1].alive ? 1 : 0)
}