const { validationResult } = require('express-validator');
const Post = require('../models/schema');
const fs = require('fs');
const path = require('path');
const { clear } = require('console');


exports.getPosts = (req, res, next) => {
    const currentPage = req.body.page || 1;
    const perPage = 2;
    let totalItems;
    
    Post.find()
    .countDocuments()
    .then(count => {
        totalItems= count;
        return Post.find()
        .skip((currentPage -1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200).json({message: 'fetched successfully', posts: posts, totalItems: totalItems })  
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPosts = (req, res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('vlidation failed entered data is failed');
        error.statusCode = 422;
        throw error;
    }
    if(!req.file){
        const error = new Error('no image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title, 
        content:content, 
        imageUrl: imageUrl,
        creator: {name: 'harshjxx'} 
    });
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'post created successfully !!!',
            post: result
        });
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
    
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if(!post){
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'post fetched', post:post})
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('vlidation failed entered data is failed');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.title;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path;
    }
    if(!imageUrl){
        const error = new Error('no file picked.');
        error.statusCode = 422;
        throw error; 
    }

    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }
        if( imageUrl != post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save(); 
    })
    .then(result => {
        res.status(200).json({message: 'Post Updated', post: result});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }
        //check logged in user
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'post deleted!!'});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

const clearImage = filePath => {
    filePath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath, err => console.log(err));
};