const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  // we get a created at and updated at
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
