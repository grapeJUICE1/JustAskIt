const mongoose = require('mongoose');
const slugify = require('slugify');
const Tag = require('./tagModel');

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

    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
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
          return val.length <= 5;
        },
        "You can't have more than 5 tags",
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
  //checks if tags accosiated with the post exist in the database
  //if it doesn't exists , save the tag and continue
  //if it does , don't save the tag and continue
  // console.log(
  //   await this.model('Post').collection.dropIndex({ tags_1: [['tags', 1]] })
  // );
  if (new Set(this.tags).size !== this.tags.length) {
    console.log(this.tags.length, new Set(this.tags).size, this.tags);
    let validationError = new mongoose.Error.ValidationError(null);
    validationError.addError(
      'tags',
      new mongoose.Error.ValidatorError({
        message: 'You cant add the same tag twice',
      })
    );
    return next(validationError);
  }
  for (const tag of this.tags) {
    if (!(await Tag.findOne({ name: tag }))) {
      Tag.create({ name: tag });
    }
  }

  //populating the slug  as the title of the post
  this.slug = slugify(this.title, { lower: true });
  //populating createdAt as the current date if the created post is new
  if (this.isNew) this.createdAt = Date.now();

  next();
});

postSchema.pre(/^find/, async function (next) {
  //populating postedBy
  this.populate({ path: 'postedBy', select: '-__v -passwordChangedAt' });
  // console.log(await this.model.find({}));
  next();
});

//initializing and exporting Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
