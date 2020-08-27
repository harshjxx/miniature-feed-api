const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed');
const {body} = require('express-validator');
router.get('/posts', feedController.getPosts);

router.post('/post',[
    body('title')
    .trim()
    .isLength(),
    body('content')
    .trim()
    .isLength({min: 5})
], feedController.createPosts);

router.get('/post/:postId',feedController.getPost);

module.exports = router;