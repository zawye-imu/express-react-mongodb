const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ordering: { type: Number, required: true },
  active: {type: Boolean},
  fullname: { type: String},
  company: { type: String},
  memberID: { type: String},
  formerID: { type: String},
  mailAddress: { type: String},
  startYM: { type: Date},
  endYM: { type: Date}

});

module.exports = mongoose.model('User', userSchema);