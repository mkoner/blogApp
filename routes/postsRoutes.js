const express = require('express');
const path = require('path');
const postsRouter = express.Router();

const multer = require('multer');

const Post = require("../models/post");

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
    const isLoggedIn = req.cookies.login;
    if(isLoggedIn)
      res.render('createPost', {failed: false, loggedIn: req.cookies.login});
    else
      res.render('login',{failed:false, loggedIn: req.cookies.login});
});

postsRouter.post('/posts/new', upload.single('file'), async (req, res, next) =>{
    //console.log("file: ", req.file)
      const imageUrl = req.file.filename;
      const ownerId = '65f898cc9789ff14307ce254'
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
      }
      if(isError){
          res.render('createPost', {failed: true, loggedIn: req.cookies.login})
      } else
        res.redirect('/posts');
});


// Get all the posts, filter by title or content
postsRouter.get('/posts', async(req, res, next) =>{
    //console.log(req.query);
    try {
        // To do later filter by title or by content contains: done
        const key = req.query.searchQuery;;
        let query = {};
        if (key){
          query = {
            "$or": [{
              "title": { '$regex': '.*' + key + '.*', $options: 'i' }
          }, {
              "content": { '$regex': '.*' + key + '.*', $options: 'i' }
          }]
          }
        }
        
        const posts = await Post.find(query);
        //console.log(posts)
        res.render('posts', {posts: posts, failed: false, loggedIn: req.cookies.login});
    } catch (error) {
        //res.status(500).json({ error: error.message });
        res.render('posts', {failed: true, loggedIn: req.cookies.login})
    }
});

// Get a specific post page
postsRouter.get('/post/:id', async (req, res, next) =>{
  //console.log("get single post")
  const {id} = req.params;
  //console.log(id);
  const post = await Post.findById(id);
  //console.log(post)
  res.render('postPage', {post: post, loggedIn: req.cookies.login});
});

module.exports = postsRouter;
 