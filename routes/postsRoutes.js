const express = require('express');
const path = require('path');
const postsRouter = express.Router();

const multer = require('multer');

const Post = require("../models/post");
const User = require("../models/user");


// Specify the folder where to upload files and filename (for adding an image to a new post)
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, path.join(__dirname,'..', 'views', 'uploads'));
    },

    filename: function (req, file, callback) {
        const ext = file.originalname.split('.').pop();
        const date = new Date();
      callback(null, req.body.title.replaceAll(' ','') + date.valueOf() +'.'+ ext);
    }
  });

  const upload = multer({ 
    storage: storage,

    // Check if chosen file is a valid image:
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
 });


// CREATE NEW POST

// 1) Login-check:
postsRouter.get('/posts/new', (req, res, next) =>{
    const isLoggedIn = req.cookies.login;

    
    if(isLoggedIn)
      res.render('createPost', {failed: false, loggedIn: req.cookies.login, notImage: false});
    else
      res.render('login',{failed:false, loggedIn: req.cookies.login});
});

// 2) Post-submission:
postsRouter.post('/posts/new', upload.single('file'), async (req, res, next) =>{
    
      const imageUrl = req.file.filename;
      const ownerId = req.cookies.login;
      const newPost = new Post({
          imageUrl, 
          ownerId, 
          title: req.body.title.trim(), 
          content: req.body.content.trim(),
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
          res.render('createPost', {failed: true, loggedIn: req.cookies.login, notImage: false})
      } else
        res.redirect('/posts');
});


// Get all the posts, search by title or content
postsRouter.get('/posts', async(req, res, next) =>{
    
    try {
       
        const key = req.query.searchQuery;
        let query = {};
        // check if user entered a search term:
        if (key){
          // check if search term is in title or in content of article:
          query = {
            "$or": [{
              "title": { '$regex': '.*' + key + '.*', $options: 'i' }
          }, {
              "content": { '$regex': '.*' + key + '.*', $options: 'i' }
          }]
          }
        }
        
        const posts = await Post.find(query).sort({postedDate: -1});
      
        res.render('posts', {posts: posts, failed: false, loggedIn: req.cookies.login});
    } catch (error) {
        res.render('posts', {failed: true, loggedIn: req.cookies.login})
    }
});


// Get specific post page
postsRouter.get('/post/:id', async (req, res, next) =>{
  const {id} = req.params;
  
  const post = await Post.findById(id);
  const author = await User.findById(post.ownerId);
  const views = post.views;
  await Post.findByIdAndUpdate(id, {views: views+1});
 
  res.render('postPage', {post: post, author: author, loggedIn: req.cookies.login});
});

postsRouter.get('/posts/update/:id', async(req, res, next) => {

  if(req.cookies.login){
    const {id} = req.params;
    const post = await Post.findById(id);
   
    res.render('updatePost', {post: post, failed: false, loggedIn: req.cookies.login});
  } else 
    res.render('login',{failed:false, loggedIn: req.cookies.login});
});


// UPDATE POST
postsRouter.post('/posts/update/:id',  async (req, res, next) =>{

  const filter = {_id: req.params.id};
  const newPost = {};
  for(let prop in req.body){
      if(req.body[prop]) 
        newPost[prop] = req.body[prop].trim();
  }

  try {
      await Post.findByIdAndUpdate(filter, newPost);
      res.redirect('back');
  } catch (error) {
    res.render('updatePost', {post: post, failed: true, loggedIn: req.cookies.login});
  }  

});

// DELETE POST
postsRouter.get('/posts/delete/:id',  async (req, res, next) =>{

  const {id} = req.params;
  try {
      await Post.findByIdAndDelete(id);
      res.redirect('back');
  } catch (error) {
    const user = await User.findById(req.cookies.login);
    const posts = await Post.find({ownerId: user._id});
    res.render('profile', {user: user, posts: posts, accountError: false, loggedIn: req.cookies.login, postError: "Error deleting post"});
  }  

});



module.exports = postsRouter;
 