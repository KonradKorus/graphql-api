const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');

const port = process.env.PORT || 5000;
const schema = require('./schema/schema');
const connectDB = require('./config/db');
const app = express();
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

app.use(errorHandler);

app.listen(port, console.log(`server running on port ${port}`));
