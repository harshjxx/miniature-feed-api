exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'first post', 
            content: 'this is the first post!', 
            imageUrl: 'images/duck.jpg',
            creator:{
                name: 'Harsh'
            },
            createdAt: new Date()
        }] 
    });
};

exports.createPosts = (req, res, next) => {
    //create post
    const title = req.body.title;
    const content = req.body.content;

    console.log(title, content);
    res.status(201).json({
        message: 'post created successfully !!!',
        post: {id: new Date().toISOString(), title: title, content:content }
    });
};