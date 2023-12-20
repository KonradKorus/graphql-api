const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const port = process.env.PORT || 5000;
// const schema = require('./schema/schema');
const connectDB = require('./config/db');
const app = express();
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./utils/swagger_output.json');
const User = require('./models/User');
const Post = require('./models/Post');
const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongoose').Types;
const {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getSinglePost,
} = require('./controllers/postController');
const { express: altairExpress } = require('altair-express-middleware');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//graphql playground=============================

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    login: { type: GraphQLString },
    password: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    address: { type: GraphQLString },
    gender: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    profilePictureURL: { type: GraphQLString },
    education: { type: GraphQLString },
    occupation: { type: GraphQLString },
    bio: { type: GraphQLString },
    nationality: { type: GraphQLString },
    relationshipStatus: { type: GraphQLString },
    accountCreationDate: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    isActive: { type: GraphQLBoolean },
    intrests: { type: GraphQLList(GraphQLString) },
    skills: { type: GraphQLList(GraphQLString) },
    socialMediaLinks: { type: GraphQLList(GraphQLString) },
    friends: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({ _id: { $in: parent.friends } });
      },
    },
    posts: {
      type: GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ authorId: { $eq: parent.id } });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    category: { type: GraphQLString },
    content: { type: GraphQLString },
    likeCount: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.authorId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        category: { type: GraphQLString },
        authorId: { type: GraphQLID },
        dateSortingOrder: { type: GraphQLString },
      },
      resolve(parent, args) {
        const filterConditions = {};

        if (args.category) {
          filterConditions.category = args.category;
        }

        if (args.authorId) {
          filterConditions.authorId = args.authorId;
        }

        const sortingOrder = { date: 'asc' };

        if (args.dateSortingOrder) {
          sortingOrder.date = args.dateSortingOrder;
        }

        return Post.find(filterConditions).sort(sortingOrder);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPost: {
      type: PostType,
      args: {
        date: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        likeCount: { type: GraphQLNonNull(GraphQLInt) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        category: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const post = new Post({
          date: args.date,
          category: args.category,
          content: args.content,
          likeCount: args.likeCount,
          authorId: args.authorId,
        });

        try {
          const newPost = await post.save();
          return newPost;
        } catch (error) {
          throw new Error('Error creating a new post: ' + error.message);
        }
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return await Post.findByIdAndDelete(args.id);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLString },
        content: { type: GraphQLString },
        likeCount: { type: GraphQLInt },
        authorId: { type: GraphQLString },
        category: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const post = await Post.findByIdAndUpdate(
            args.id,
            {
              $set: {
                date: args.date,
                content: args.content,
                likeCount: args.likeCount,
                authorId: args.authorId,
                category: args.category,
              },
            },
            { new: true }
          );

          if (!post) {
            throw new Error('User not found');
          }
          return post;
        } catch (error) {
          throw new Error('Error updating the user: ' + error.message);
        }
      },
    },
  },
});
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

// addUser: {
//   type: UserType, // Use the UserType for the response
//   args: {
//     login: { type: GraphQLNonNull(GraphQLString) },
//     password: { type: GraphQLNonNull(GraphQLString) },
//     firstName: { type: GraphQLNonNull(GraphQLString) },
//     lastName: { type: GraphQLNonNull(GraphQLString) },
//     email: { type: GraphQLNonNull(GraphQLString) },
//     phone: { type: GraphQLNonNull(GraphQLString) },
//     address: { type: GraphQLNonNull(GraphQLString) },
//     gender: { type: GraphQLNonNull(GraphQLString) },
//     birthDate: { type: GraphQLNonNull(GraphQLString) },
//     profilePictureURL: { type: GraphQLNonNull(GraphQLString) },
//     education: { type: GraphQLNonNull(GraphQLString) },
//     occupation: { type: GraphQLNonNull(GraphQLString) },
//     bio: { type: GraphQLNonNull(GraphQLString) },
//     nationality: { type: GraphQLNonNull(GraphQLString) },
//     relationshipStatus: { type: GraphQLNonNull(GraphQLString) },
//     accountCreationDate: { type: GraphQLNonNull(GraphQLString) },
//     lastActive: { type: GraphQLNonNull(GraphQLString) },
//     friends: { type: GraphQLList(GraphQLID) },
//   },
//   async resolve(parent, args) {
//     const user = new User({
//       login: args.login,
//       password: args.password,
//       firstName: args.firstName,
//       lastName: args.lastName,
//       email: args.email,
//       phone: args.phone,
//       address: args.address,
//       gender: args.gender,
//       birthDate: args.birthDate,
//       profilePictureURL: args.profilePictureURL,
//       education: args.education,
//       occupation: args.occupation,
//       bio: args.bio,
//       nationality: args.nationality,
//       relationshipStatus: args.relationshipStatus,
//       accountCreationDate: args.accountCreationDate,
//       lastActive: args.lastActive,
//       friends: args.friends,
//     });

//     try {
//       // Save the user to the database
//       const newUser = await user.save();
//       return newUser;
//     } catch (error) {
//       throw new Error('Error creating a new user: ' + error.message);
//     }
//   },
// },
// deleteUser: {
//   type: UserType,
//   args: {
//     id: { type: GraphQLNonNull(GraphQLID) },
//   },
//   resolve(parent, args) {
//     return User.findByIdAndDelete(args.id);
//   },
// },
// updateUser: {
//   type: UserType, // Use the UserType for the response
//   args: {
//     id: { type: GraphQLNonNull(GraphQLID) },
//     login: { type: GraphQLString },
//     password: { type: GraphQLString },
//     firstName: { type: GraphQLString },
//     lastName: { type: GraphQLString },
//     email: { type: GraphQLString },
//     phone: { type: GraphQLString },
//     address: { type: GraphQLString },
//     gender: { type: GraphQLString },
//     birthDate: { type: GraphQLString },
//     profilePictureURL: { type: GraphQLString },
//     education: { type: GraphQLString },
//     occupation: { type: GraphQLString },
//     bio: { type: GraphQLString },
//     nationality: { type: GraphQLString },
//     relationshipStatus: { type: GraphQLString },
//     accountCreationDate: { type: GraphQLString },
//     lastActive: { type: GraphQLString },
//     friends: { type: GraphQLList(GraphQLID) },
//   },
//   async resolve(parent, args) {
//     try {
//       const user = await User.findByIdAndUpdate(
//         args.id,
//         {
//           $set: {
//             login: args.login,
//             password: args.password,
//             firstName: args.firstName,
//             lastName: args.lastName,
//             email: args.email,
//             phone: args.phone,
//             address: args.address,
//             gender: args.gender,
//             birthDate: args.birthDate,
//             profilePictureURL: args.profilePictureURL,
//             education: args.education,
//             occupation: args.occupation,
//             bio: args.bio,
//             nationality: args.nationality,
//             relationshipStatus: args.relationshipStatus,
//             accountCreationDate: args.accountCreationDate,
//             lastActive: args.lastActive,
//             friends: args.friends,
//           },
//         },
//         { new: true }
//       );

//       if (!user) {
//         throw new Error('User not found');
//       }

//       return user;
//     } catch (error) {
//       throw new Error('Error updating the user: ' + error.message);
//     }
//   },
// },

// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   // mutation,
// });

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
//============================================

app.use('/api/test', getPosts);

// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));
// pierwszy punkt inzynierka
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// app.get('/api/users/:id', async (req, res) => {
//   const singleUser = await User.findById(req.params.id);
//   res.status(200).json(singleUser);
// });

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

//drugi punkt inżynierki

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

//trzeci punkt inzynierki
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

//inżynierka 5 punkt

// app.get('/api/users/:id', async (req, res) => {
//   const singleUser = await User.findById(req.params.id);
//   res.status(200).json(singleUser);
// });

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

app.get('/api/users/:id', async (req, res) => {
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


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
