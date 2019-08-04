import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Router } from 'react-router-dom';
import { setContext } from 'apollo-link-context';

import './index.css';
import App from './App.tsx';
import * as serviceWorker from './serviceWorker';
import history from "./history";
import { AUTH_TOKEN } from './constants';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:3000/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <Router history={history}>
    <ApolloProvider client={client}>
      <App client={client} />
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
