import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import Board from './Board'
import { AUTH_TOKEN } from '../constants';
import history from '../history';

const GENERATIONS_QUERY = gql`
  {
    currGeneration {
      alive
    },
    currGenerationIndex
  }
`

const NEXT_GEN_MUTATION = gql`
  mutation NextGeneration {
    nextGeneration {
      alive
    }
  }
`

const PREV_GEN_MUTATION = gql`
  mutation PrevGeneration {
    prevGeneration {
      alive
    }
  }
`

export default function Game({ client }: { client: any }) {
  const evenHandler = (e: any) => {
    if (e.keyCode === 13) { // if Enter
      client.mutate({
        mutation: NEXT_GEN_MUTATION,
        refetchQueries: () => [{ query: GENERATIONS_QUERY }]
      })
    } else if (e.keyCode === 32) { // space
      e.preventDefault()
      client.mutate({
        mutation: PREV_GEN_MUTATION,
        refetchQueries: () => [{ query: GENERATIONS_QUERY }]
      })
    }
  }

  useEffect(() => {
    window.addEventListener("keypress", evenHandler, false)
    return () => {
      window.removeEventListener("keypress", evenHandler, false)
    }
  })

  useEffect(() => {
    const jwtToken = localStorage.getItem(AUTH_TOKEN)
    if (!jwtToken) {
      history.push('/login')
    }
  })

  return (
    <>
      <Query query={GENERATIONS_QUERY}>
      {({ loading, error, data }: { loading: boolean, error?: any, data: any }) => {
        if (loading) return <div>Fetching</div>
        if (error) {
          console.error(error)
          return <div>Error</div>
        }

        const currGeneration = data.currGeneration
        return (
          <>
            <label style={{ float: 'right' }}>{data.currGenerationIndex}</label>
            <Board cells={currGeneration} />
          </>
        )
      }}
      </Query>      
    </>
  );
}
