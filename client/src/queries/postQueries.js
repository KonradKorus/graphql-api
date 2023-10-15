import { gql } from '@apollo/client';

const GET_POST = `
  query getPost {
    post(id:"650efbcb6655fefcac6bdc2c"){
      id
      date
      content
      likeCount
    }
  }
`;

export { GET_POST };
