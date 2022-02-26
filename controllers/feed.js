const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'Posts are fetched successfully',
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // res.status(200).json({
  //   posts: [
  //     {
  //       _id: '1',
  //       title: 'First Post',
  //       content: 'This is the first API post!',
  //       imageUrl: 'images/395497.jpg',
  //       creator: {
  //         name: 'Anthony',
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //creating a new Error Object
    const error = new Error('Validation failed, data is incorrect');
    error.statusCode = 422;
    //will exit to locate the next erorr handling middleware/function
    throw err;
    // return res.status(422).json({
    //   message: 'Validation failed, data is incorrect',
    //   errors: errors.array(),
    // });
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'image/395497.jpg',
    creator: { name: 'Anthony' },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully !',
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      //async
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        // even if we are in "then" throwing will allow it to reach the next catch block
        throw error;
      }
      res.status(200).json({
        message: 'Post fetched',
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
