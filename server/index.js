const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const { GraphQLSchema } = require('graphql');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const { errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/db');
const { RootQuery, mutation } = require('./schema/schema');
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//GraphQL
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

app.use(
  '/graphql',
  graphqlHTTP({ schema, graphiql: process.env.NODE_ENV === 'development' })
);

//REST API
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.get('/api/users/:id', async (req, res) => {
  const singleUser = await User.findById(req.params.id);
  res.status(200).json(singleUser);
});

app.post('/api/users', async (req, res) => {
  const userFromBody = req.body;
  const user = await User.create(userFromBody);
  res.status(200).json(user);
});

app.put('/api/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

app.get('/api/posts', async (req, res) => {
  const queryParams = req.query;
  const filterConditions = {};
  const dateSortingOrder = { date: 'asc' };

  if (queryParams.category) {
    filterConditions.category = queryParams.category;
  }

  if (queryParams.authorId) {
    filterConditions.authorId = queryParams.authorId;
  }

  if (queryParams.dateSortingOrder) {
    dateSortingOrder.date = queryParams.dateSortingOrder;
  }

  const posts = await Post.find(filterConditions).sort(dateSortingOrder);

  res.status(200).json(posts);
});

app.get('/api/users/:id/is-active', async (req, res) => {
  const singleUser = await User.findById(req.params.id);
  const preparedResponse = {
    isActive: singleUser.isActive,
  };

  res.status(200).json(preparedResponse);
});

app.get('/api/users/:id/basic-informations', async (req, res) => {
  const singleUser = await User.findById(req.params.id);
  const preparedResponse = {
    firstName: singleUser.firstName,
    lastName: singleUser.lastName,
    profilePictureURL: singleUser.profilePictureURL,
    friends: singleUser.friends,
  };

  res.status(200).json(preparedResponse);
});

app.get('/api/users/:id/posts', async (req, res) => {
  const postsForUserId = await Post.find({ authorId: req.params.id });
  res.status(200).json(postsForUserId);
});

app.get('/api/users/:id/friends', async (req, res) => {
  const friendsForUserId = await User.find({
    friends: { $in: req.params.id },
  });
  res.status(200).json(friendsForUserId);
});

app.get('/api/users/:id/under-fetching-solution', async (req, res) => {
  const userId = req.params.id;

  const [singleUser, postsForUserId, friendsForUserId] = await Promise.all([
    User.findById(userId),
    Post.find({ authorId: userId }),
    User.find({ friends: { $in: userId } }),
  ]);

  const response = {
    user: singleUser,
    posts: postsForUserId,
    friends: friendsForUserId,
  };

  res.status(200).json(response);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
