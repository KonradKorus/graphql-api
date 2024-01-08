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
    lastLogin: { type: GraphQLString },
    isActive: { type: GraphQLBoolean },
    interests: { type: GraphQLList(GraphQLString) },
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
    addUser: {
      type: UserType,
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
      type: UserType,
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

exports.mutation = mutation;
exports.RootQuery = RootQuery;
// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   mutation,
// });
