const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  recentlyAdded: [
    {
      guid: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      original_release_date: {
        type: String || null,
        required: false
      },
      platforms: [] || null,
      image: {
        original_url: {
          type: String || null,
          required: false
        }
      },
      havePlayed: {
        type: Boolean,
        required: false
      }
    }
  ],
  games: [
    {
      guid: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      original_release_date: {
        type: String || null,
        required: false
      },
      platforms: [] || null,
      image: {
        original_url: {
          type: String || null,
          required: false
        }
      },
      havePlayed: {
        type: Boolean,
        required: false
      }
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
