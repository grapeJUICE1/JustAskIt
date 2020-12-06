const mongoose = require('mongoose');
const Post = require('./postModel');

//initializing answer schema
const answerSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'answer must belong to a post.'],
  },
  content: {
    type: String,
    required: [true, 'Please provide the content of your answer'],
  },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
  voteCount: { type: Number, default: 0 },
  createdAt: Date,
  postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

answerSchema.pre('save', async function (next) {
  //populating createdAt as the current date if the created answer is new
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});

answerSchema.pre(/^find/, function (next) {
  //populating postedBy
  this.populate({ path: 'postedBy', select: 'name email photo' });
  // this.populate({ path: 'post' });
  next();
});

//initializing and exporting Answer model
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
