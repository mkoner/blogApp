const express = require('express');
const path = require('path');
const postsRouter = express.Router();

const multer = require('multer');

const Post = require("../models/post");
const { appendFile } = require('fs');

// Specify the folder where to upload files and filename
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, path.join(__dirname,'..', 'views', 'uploads'));
    },
    filename: function (req, file, callback) {
        const ext = file.originalname.split('.').pop();
        const date = new Date();
      callback(null, req.body.title + date.valueOf() +'.'+ ext);
    }
  });

  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
 });

postsRouter.get('/posts/new', (req, res, next) =>{
    res.render('createPost', {failed: false});
});

postsRouter.post('/posts/new', upload.single('file'), async (req, res, next) =>{
    //console.log("file: ", req.file)
    const imageUrl = req.file.filename;
    const ownerId = '65f75e82f733b09b5c51d803'
    const newPost = new Post({
        imageUrl, 
        ownerId, 
        title: req.body.title, 
        content: req.body.content, 
        postedDate: new Date()});
        let isError = false;
    try {
        await newPost.save();
        console.log("Post created successfully!");
    } catch (error) {
        console.error("Error creating post:", error.message);
        isError = true;
        res.send("errooor")
    }
    if(isError){
        res.render('createPost', {failed: true})
    } else
      res.redirect('/');
});


// Get all the posts, filter by title or content
postsRouter.get('/posts', async(req, res, next) =>{
    //console.log(req.query);
    try {
        // To do later filter by title or by content contains
        const { title, content} = req.query;
        const query = {title: req.query.searchQuery.trim()};

        if (title) query.title = title.trim();
        if (content) query.content = content.trim();

        const posts = await Post.find(query);
        //console.log(posts)
        res.render('posts', {posts: posts});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = postsRouter;
 