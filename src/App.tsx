import React from 'react'
import logo from './logo.svg'
import './App.css'
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <Board cells={
        [
          [{ alive: false },{ alive: true },{ alive: false }], [{ alive: false },{ alive: false },{ alive: true }]
        ]
      } />
    </div>
  );
}

export default App;
