import classnames from 'classnames'
import React from 'react'

export interface CellProps {
  alive: boolean
}
export default function Cell({
  alive
}: CellProps) {
  return <div className={classnames('cell', { 'cell--alive': alive })}></div>
}