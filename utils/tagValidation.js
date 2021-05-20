const mongoose = require('mongoose');
const Tag = require('../models/tagModel');

const tagValidation = async (tags, next, Post) => {
  //checks if tags accosiated with the post exist in the database
  //if it doesn't exists , save the tag and continue
  //if it does , don't save the tag and continue
  if (new Set(tags).size !== tags.length) {
    let validationError = new mongoose.Error.ValidationError(null);
    validationError.addError(
      'tags',
      new mongoose.Error.ValidatorError({
        message: 'You cant add the same tag twice',
      })
    );
    return next(validationError);
  }

  for (const tag of tags) {
    let tagDocument = await Tag.findOne({ name: tag });
    if (!tagDocument) {
      tagDocument = await Tag.create({ name: tag });
    }
    tagDocument.postCount = await Post.countDocuments({
      tags: {
        $elemMatch: { $in: tag },
      },
    });
    tagDocument.save();
  }
  return;
};

module.exports = tagValidation;
