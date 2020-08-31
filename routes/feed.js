const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed');
const {body} = require('express-validator');
router.get('/posts', feedController.getPosts);
const isAuth =  require('../middleware/auth');

router.post('/post',isAuth,[
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
], feedController.createPosts);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth,[
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
], feedController.updatePost);

router.delete('/post/:postId', isAuth,feedController.deletePost);

module.exports = router;