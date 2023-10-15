import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { useCallback } from 'react';

export const useGraphql = (query, querySetter) => {
  console.log('method: POST');
  console.log('endpoint: http://localhost:5000/graphql');
  console.log(`query`, query);

  const queryQL = gql`
    ${query}
  `;
  console.log(queryQL);
  querySetter(queryQL);
  const { loading, error, data } = useQuery(queryQL);

  if (!error && !loading) {
    console.log(data);
  }
};
