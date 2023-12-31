import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Project from './pages/Project';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: cache,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/projects/:id" element={<Project />}></Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
