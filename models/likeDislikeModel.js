const mongoose = require('mongoose');
const Post = require('./postModel');
const Answer = require('./answerModel');
const Comment = require('./commentModel');
const AppError = require('./../utils/AppError');

//initializing likeDislikeSchema schema
const likeDislikeSchema = mongoose.Schema({
  type: {
    type: String,
    enums: {
      values: ['like', 'dislike'],
      message: 'you can either like or dislike',
    },
    required: ['True', 'Chose wether to like or dislike'],
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  for: {
    type: String,
    enums: {
      values: ['Post', 'Answer', 'Comment'],
      message: 'you can like/dislike either a post or answer or comment',
    },
    required: ['True', 'Chose wether to like/dislike a post or answer'],
  },
  doc: { type: mongoose.Schema.ObjectId, refPath: 'for', required: true },
});

likeDislikeSchema.pre('save', async function (next) {
  //The code below checks that
  //if doc field in the created document
  //is a valid post , comment or answer
  //if it is then it increases the
  //like or dislike count on the desired
  //post answer or comment and updates it
  let doc;
  if (this.for === 'Post') {
    doc = await Post.findById(this.doc);
  } else if (this.for === 'Answer') {
    doc = await Answer.findById(this.doc);
  } else if (this.for === 'Comment') {
    doc = await Comment.findById(this.doc);
  }

  if (!doc) return next(new AppError('No document found with that id', 404));
  doc.voteCount = doc.likeCount - doc.dislikeCount;
  doc.save();
});

likeDislikeSchema.pre(/^find/, function (next) {
  next();
});

//initializing and exporting LikeDislike model
const LikeDislike = mongoose.model('LikeDislike', likeDislikeSchema);

module.exports = LikeDislike;
