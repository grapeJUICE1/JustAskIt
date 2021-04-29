const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

//initializing user schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide your name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'please provide your email '],
    unique: true,
    validate: [validator.isEmail, 'please provide an valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'please provide a password '],
    min: [8, 'password must be greater than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please provide an password confirmed'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords dont match',
    },
  },
  bio: {
    type: String,
    default: 'None',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: String,
  },
  joinedAt: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
});

userSchema.pre('save', async function (next) {
  //populating joinedAt as the current date if the created user is new
  if (this.isNew) this.joinedAt = Date.now();

  //checking if the password was modified or updated
  //if password was not modified , break out of this function and save the user
  //else continue

  if (!this.isModified('password')) return next();

  //hashing users Password
  this.password = await bcrypt.hash(this.password, 12);

  //making passwordConfirm undefined so that it doesn't get revealed
  this.passwordConfirm = undefined;
  next();
});

//this instance method checks if two passwords match
userSchema.methods.comparePassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

//this instance methods checks if password was changed recently compared to the jwt timestamp
userSchema.methods.checkIfPasswordChanged = function (JWTstamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //return true if password was channged after issueing jwt | else return false
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

//initializing and exporting User model
const User = mongoose.model('User', userSchema);

module.exports = User;
