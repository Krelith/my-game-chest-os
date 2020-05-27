const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  // User's email address
  email: {
    type: String,
    required: true
  },
  // Randomly-generated code
  code: {
    type: String,
    required: true
  }
});

const Code = mongoose.model('Code', CodeSchema);

module.exports = Code;
