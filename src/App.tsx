import React, { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'

function App() {
  const [gens, setGens] = useState([Array(100).fill(0).map(row => (Array(100).fill(0).map(cell => ({ alive: (Math.random() < 0.5) }))))])

  useEffect(() => {
    const evenHandler = (e: any) => {
      if (e.keyCode === 13) { // if Enter
        setGens([
          ...gens,
          Array(100).fill(0).map(row => (Array(100).fill(0).map(cell => ({ alive: (Math.random() < 0.5) }))))
        ])
      }
    }
    window.addEventListener("keypress", evenHandler, false)

    return () => {
      window.removeEventListener("keypress", evenHandler, false)
    }
  }, [])

  return (
    <div className="App">
      <Board cells={
        gens.length ? gens[gens.length - 1] : []
      } />
    </div>
  );
}

export default App;
