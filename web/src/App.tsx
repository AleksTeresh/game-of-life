import React from 'react'
import { Switch, Route } from 'react-router-dom'

import './App.css'
import Game from './components/Game'
import Login from './components/Login'

export default function App({ client }: { client: any }) {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={() => <Game client={client} />} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  )
}
