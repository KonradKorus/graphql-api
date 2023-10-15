import { gql } from '@apollo/client';

const GET_ALL_USERS = `
  query getUsers {
    allUsers {
      id
      login
      password
      firstName
      lastName
      email
      phone
      address
      gender
      birthDate
      profilePictureURL
      education
      occupation
      bio
      nationality
      relationshipStatus
      accountCreationDate
      lastActive
    }
  }
`;

const GET_PROJECT = gql`
  query getProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`;

export { GET_ALL_USERS, GET_PROJECT };
