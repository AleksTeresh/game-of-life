import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import history from "../history"
import { AUTH_TOKEN } from '../constants'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

interface LoginResponseData {
  login: {
    token: string
  }
}

interface SingupResponseDate {
  signup: {
    token: string
  }
}

type AuthResponseData = LoginResponseData | SingupResponseDate

const isLoginResponse = (data: AuthResponseData): data is LoginResponseData => 'login' in data

const saveUserData = (token: string) => {
  localStorage.setItem(AUTH_TOKEN, token)
}

const confirm = (data: AuthResponseData) => {
  const { token } = isLoginResponse(data) ? data.login : data.signup
  saveUserData(token)
  history.push(`/`)
}

const Login: React.SFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [login, setIsLogin] = useState(true)  

  return (
    <div>
      <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={(data: AuthResponseData) => confirm(data)}
        >
          {(mutation: () => void) => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login ? 'login' : 'create account'}
            </div>
          )}
        </Mutation>
        <div
          className="pointer button"
          onClick={() => setIsLogin(!login)}
        >
          {login
            ? 'need to create an account?'
            : 'already have an account?'}
        </div>
      </div>
    </div>
  )
}

export default Login
