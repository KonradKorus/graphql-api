const { projects, clients } = require('../sampleData');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require('graphql');

const Post = require('../models/Post');
const User = require('../models/User');

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
    lastActive: { type: GraphQLString },
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
    allUsers: {
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
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.findById(args.id);
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
      },
      async resolve(parent, args) {
        const post = new Post({
          date: args.date,
          content: args.content,
          likeCount: args.likeCount,
          authorId: args.authorId,
        });

        try {
          // Save the user to the database
          const newPost = await post.save();
          return newPost;
        } catch (error) {
          throw new Error('Error creating a new user: ' + error.message);
        }
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Post.findByIdAndDelete(args.id);
      },
    },
    addUser: {
      type: UserType, // Use the UserType for the response
      args: {
        login: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLNonNull(GraphQLString) },
        birthDate: { type: GraphQLNonNull(GraphQLString) },
        profilePictureURL: { type: GraphQLNonNull(GraphQLString) },
        education: { type: GraphQLNonNull(GraphQLString) },
        occupation: { type: GraphQLNonNull(GraphQLString) },
        bio: { type: GraphQLNonNull(GraphQLString) },
        nationality: { type: GraphQLNonNull(GraphQLString) },
        relationshipStatus: { type: GraphQLNonNull(GraphQLString) },
        accountCreationDate: { type: GraphQLNonNull(GraphQLString) },
        lastActive: { type: GraphQLNonNull(GraphQLString) },
        friends: { type: GraphQLList(GraphQLID) },
      },
      async resolve(parent, args) {
        const user = new User({
          login: args.login,
          password: args.password,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phone: args.phone,
          address: args.address,
          gender: args.gender,
          birthDate: args.birthDate,
          profilePictureURL: args.profilePictureURL,
          education: args.education,
          occupation: args.occupation,
          bio: args.bio,
          nationality: args.nationality,
          relationshipStatus: args.relationshipStatus,
          accountCreationDate: args.accountCreationDate,
          lastActive: args.lastActive,
          friends: args.friends,
        });

        try {
          // Save the user to the database
          const newUser = await user.save();
          return newUser;
        } catch (error) {
          throw new Error('Error creating a new user: ' + error.message);
        }
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return User.findByIdAndDelete(args.id);
      },
    },
    updateUser: {
      type: UserType, // Use the UserType for the response
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
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
        lastActive: { type: GraphQLString },
        friends: { type: GraphQLList(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          const user = await User.findByIdAndUpdate(
            args.id,
            {
              $set: {
                login: args.login,
                password: args.password,
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
                phone: args.phone,
                address: args.address,
                gender: args.gender,
                birthDate: args.birthDate,
                profilePictureURL: args.profilePictureURL,
                education: args.education,
                occupation: args.occupation,
                bio: args.bio,
                nationality: args.nationality,
                relationshipStatus: args.relationshipStatus,
                accountCreationDate: args.accountCreationDate,
                lastActive: args.lastActive,
                friends: args.friends,
              },
            },
            { new: true }
          );

          if (!user) {
            throw new Error('User not found');
          }

          return user;
        } catch (error) {
          throw new Error('Error updating the user: ' + error.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
