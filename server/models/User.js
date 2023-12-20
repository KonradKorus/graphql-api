const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  login: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  birthDate: { type: Date },
  profilePictureURL: { type: String },
  education: { type: String },
  occupation: { type: String },
  bio: { type: String },
  nationality: { type: String },
  relationshipStatus: {
    type: String,
    enum: ['single', 'married', 'divorced'],
  },
  accountCreationDate: { type: Date },
  lastLogin: { type: Date },
  isActive: { type: Boolean },
  intrests: [{ type: String }],
  skills: [{ type: String }],
  socialMediaLinks: [{ type: String }],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
