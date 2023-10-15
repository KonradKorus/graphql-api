import React from 'react';
import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import GraphQLWrapper, { useGraphql } from '../apiCalls/graphQLWrapper';
import { GET_ALL_USERS } from '../queries/userQueries';
import NetworkInfo from './NetworkInfo';
import { useLazyQuery } from '@apollo/client';
import { GET_POST } from '../queries/postQueries';
const URL = 'http://localhost:5000/api';

const graphqlObject = {
  method: 'POST',
  endpoint: 'http://localhost:5000/graphql',
  body: '',
};

const restApiObject = {
  method: '',
  endpoint: '',
  body: '',
};

const processRestQueries = async (restQueries, setRestQueries) => {
  const query = restQueries[0];

  try {
    const response = await fetch(query.endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Data:', data);

    var items = restQueries;

    const item = {
      ...restQueries[0],
      response: data,
    };

    items[0] = item;

    await setRestQueries(items);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const processQlQuery = async (setQlQuery, data, qlQuery) => {
  // console.log(data, '2');

  if (data && data[qlQuery.nameOfQuery]) {
    setQlQuery({ ...qlQuery, response: data[qlQuery.nameOfQuery] });
    // console.log(qlQuery, 'grphql');
  }
};

const Menu = () => {
  const [qlQuery, setQlQuery] = useState({});
  const [qlRequest, setQlRequest] = useState({});
  const [restQueries, setRestQueries] = useState([]);
  const [restRequests, setRestRequests] = useState([]);
  var [performQlQuery, { loading, data }] = useLazyQuery(gql`
    ${qlQuery.body ? qlQuery.body : GET_POST}
  `);

  useEffect(() => {
    if (restQueries.length > 0) {
      processRestQueries(restQueries, setRestRequests);
    }
  }, [restQueries]);

  useEffect(() => {
    // console.log(qlQuery, 'useEffect');
    if (qlQuery) {
      setQlRequest({ ...qlQuery, response: data });
      processQlQuery(setQlRequest, data, qlQuery);
    }
  }, [performQlQuery, data, qlQuery]);

  return (
    <>
      <div className="justify-content-beetwen mb-3">Choose operation</div>
      <button
        className="btn btn-secondary"
        onClick={async () => {
          await performQlQuery();
          setQlQuery({
            ...graphqlObject,
            body: GET_ALL_USERS,
            nameOfQuery: 'allUsers',
          });
          setRestQueries([
            { ...restApiObject, method: 'GET', endpoint: `${URL}/users` },
          ]);
          // console.log(restQueries);
        }}
      >
        Get all users
      </button>
      <button
        className="btn btn-secondary mx-3"
        onClick={async () => {
          await performQlQuery();

          setQlQuery({
            ...graphqlObject,
            body: GET_POST,
            nameOfQuery: 'post',
          });
          setRestQueries([
            {
              ...restApiObject,
              method: 'GET',
              endpoint: `${URL}/posts/650efbcb6655fefcac6bdc2c`,
            },
          ]);
          // console.log(restQueries);
        }}
      >
        Get Post
      </button>
      <NetworkInfo qlQuery={qlRequest} restQuery={restRequests}></NetworkInfo>
    </>
  );
};

export default Menu;
