const mongoose = require('mongoose');
const slugify = require('slugify');
const Tag = require('./tagModel');

const TagValidation = require('../utils/tagValidation');
const tagValidation = require('../utils/tagValidation');

//initializing post schema
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for your post'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'A Post title name must have less or equal then 100 characters',
      ],
      minlength: [
        10,
        'A Post title  must have more or equal then 10 characters',
      ],
    },
    slug: String,
    content: {
      type: String,
      required: [true, 'Please provide the content of your post'],
    },
    contentWordCount: {
      type: Number,
      required: [true, 'Please provide content count for your post'],
      min: [25, 'your post should have atleast 25 words'],
    },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    // userDidLike: { type: Boolean, default: false },
    // userDidDislike: { type: Boolean, default: false },
    createdAt: Date,
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A post must be posted by someone'],
    },
    tags: {
      type: [
        {
          type: String,
          required: [true, 'Please add upto one tag'],
        },
      ],
      validate: [
        (val) => {
          return val.length <= 5 && val.length > 0;
        },
        "You need to have atleast 1 tag and can't have more than 5 tags",
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('answers', {
  ref: 'Answer',
  foreignField: 'post',
  localField: '_id',
});

postSchema.pre('save', async function (next) {
  tagValidation(this.tags, next, Post);
  //populating the slug  as the title of the post
  this.slug = slugify(this.title, { lower: true });
  //populating createdAt as the current date if the created post is new
  if (this.isNew) this.createdAt = Date.now();

  next();
});

postSchema.pre('findOneAndDelete', async function (next) {
  let postToBeDeleted = await this.model.findOne(this.getQuery());
  for (const tag of postToBeDeleted?.tags) {
    let tagDocument = await Tag.findOne({ name: tag });
    tagDocument.postCount -= 1;
    tagDocument.save();
  }
  next();
});

postSchema.pre(/^find/, async function (next) {
  //populating postedBy
  this.populate({ path: 'postedBy', select: '-__v -passwordChangedAt' });

  next();
});

//initializing and exporting Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
