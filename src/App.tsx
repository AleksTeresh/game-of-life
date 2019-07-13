import React, { useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const GENERATIONS_QUERY = gql`
  {
    currGeneration {
      alive
    }
  }
`

export default function App() {
  const evenHandler = (e: any) => {
    if (e.keyCode === 13) { // if Enter
      
    } else if (e.keyCode === 32) { // space
      
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
      <Query query={GENERATIONS_QUERY}>
      {({ loading, error, data }: { loading: boolean, error?: any, data: any }) => {
        if (loading) return <div>Fetching</div>
        if (error) {
          console.error(error)
          return <div>Error</div>
        }

        const currGeneration = data.currGeneration
        return (
          <Board cells={currGeneration} />
        )
      }}
      </Query>      
    </div>
  );
}
