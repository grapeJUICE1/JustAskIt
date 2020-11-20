/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Answer = require('../models/answerModel');
const Tag = require('../models/tagModel');
const Comment = require('../models/commentModel');
const LikeDislike = require('../models/likeDislikeModel');

dotenv.config({ path: '../config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected succesfully');
  })
  .catch((err) => {
    console.log(err);
  });

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
const answers = JSON.parse(
  fs.readFileSync(`${__dirname}/answers.json`, 'utf-8')
);

const importData = async () => {
  try {
    function genTag() {
      const lol = [
        'javascript',
        'python',
        'java',
        'aws',
        'c#',
        'lol',
        'elasticsearch',
        'html',
        'css',
        'graphql',
        'c++',
        'c',
        'arduino',
        'azure',
        'cloud',
        'docker',
        'kubernetes',
        'hello',
        'rest',
        'pandas',
        'numpy',
        'tensorflow',
        'scikit-learn',
        'hasura',
        'mongoose',
        'database',
        'sql',
        'mysql',
        'postgresql',
        'wordpress',
        'drupal',
        'php',
        'google cloud platform',
        'minecraft',
        'unity',
        'unreal-engine',
        'webdev',
        'soap',
        'oop',
        'fp',
        'photoshop',
        'google',
        'algorithms',
        'data-structures',
        'ds&algo',
        'react',
        'angular',
        'vue',
        'react-native',
        'svelte',
        'emberjs',
        'mvc',
        'nodejs',
        'django',
        'flask',
        'postman',
        'apollo',
        'apache-spark',
        'apache-benchmark',
        'redis',
        'neo4j',
        'xamarin',
        'kotlin',
        'ios',
        'swift',
        'android',
        'dart',
        'flutter',
        'gdscript',
        'godot',
        'pygame',
        'lua',
        'love2d',
        'opengl',
        'data-science',
        'machine-learning',
        'assembly',
        'ssd',
        'julia',
        'golang',
        'turtle',
        'graphics',
        'ram',
        'hardware',
        'math',
        'physics',
        'server',
        'linux',
        'ethical-hacking',
        'kali-linux',
        'shell',
      ];
      const i = [];
      s = [1, 2, 3, 4, 5];
      for (let j = 0; j < s[Math.floor(Math.random() * s.length)]; j++) {
        i.push(lol[Math.floor(Math.random() * lol.length)]);
      }
      return i;
    }
    // await User.create(users);
    // await Post.create(posts);
    // const posts = await Post.find({});
    // for (const post of posts) {
    //   console.log(post.tags);
    //   console.log('2nd', post.tags);
    //   let s = genTag();
    //   // const tags = req.body.tags.trim().split(' ');
    //   for (const tag of s) {
    //     if (!(await Tag.findOne({ name: tag }))) {
    //       Tag.create({ name: tag });
    //     }
    //   }
    //   post.tags = s;
    //   console.log('3rd', post.tags);

    //   await post.save();
    // }
    const posts = await Post.find({});
    for (const post of posts) {
      post.likeCount = Math.round(Math.random() * 50);
      post.dislikeCount = Math.round(Math.random() * 30);
      const updatedPost = await post.save();
      updatedPost.voteCount = updatedPost.likeCount - updatedPost.dislikeCount;
      await updatedPost.save();
    }

    // for (const ans of answers) {
    //   await Answer.create(ans);
    //   const postOfCreatedAnswer = await Post.findById(ans.post);
    //   console.log(postOfCreatedAnswer.answerCount);
    //   postOfCreatedAnswer.answerCount = await Answer.countDocuments({
    //     post: ans.post,
    //   });
    //   postOfCreatedAnswer.save();
    //   console.log(postOfCreatedAnswer.answerCount);
    // }
    // await Comments.create(posts)
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // const tour = await Tour.deleteMany({});
    // await User.deleteMany({});
    // await Post.deleteMany({});
    await Answer.deleteMany({});
    // await Comment.deleteMany({});
    // await LikeDislike.deleteMany({});
    console.log('deleted data successfully😉😉😉');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
