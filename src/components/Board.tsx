import React from 'react'
import Cell, { CellProps } from "./Cell"

export interface Boardprops {
  cells: CellProps[][]
}
export default function Board({ cells }: Boardprops) {
  return (
    <div className='board'>
      {cells.map(cellRow => (
        <Row cells={cellRow} />
      ))}
    </div>
  )
}

interface RowProps {
  cells: CellProps[]
}
function Row({ cells }: RowProps) {
  return (
    <div className='cellRow'>
      {cells.map(cell => <Cell {...cell} />)}
    </div>
  )
}
