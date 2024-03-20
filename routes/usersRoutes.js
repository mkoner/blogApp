const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const options = {
"caseSensitive": false,
"strict": false
};

const usersRouter = express.Router(options);

const User = require("../models/user");
const Post = require("../models/post");

// USER STORAGE
//let users = [{email: 's@d', password: 's'}];

// for bCrypt
const saltRounds = 7;

// MAIN PAGE
usersRouter.get('/', async function(req,res,next){
    const popularAll = await Post.find().sort({views: -1});
    const latestAll = await Post.find().sort({postedDate: -1});
    const popular = popularAll.slice(0, 4);
    const latest = latestAll.slice(0, 4);
    res.render('main',{loggedIn: req.cookies.login, popular, latest});
})


// LOGIN
usersRouter.get('/login', function (req, res, next) {
    res.render('login',{failed:false, loggedIn: req.cookies.login});
});

usersRouter.post('/login', async function (req, res, next) {
    // #erneute formularbestätigung
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && bcrypt.compareSync(password, user.password)){
        //## same for register
        res.cookie('login',user._id);
        res.redirect('back');
    }
    else{
        res.render('login', {failed:true, loggedIn: req.cookies.login});
    }
    
    /*
    let user = { email: req.body.email, password: req.body.password }

    for (ele of users){
        if(user.email == ele.email){
            if(user.password == ele.password)
                // #redirect
                res.redirect('/');

            // login failed (wrong password)
            //res.render('login', {failed:true});
        }
    }

    // login failed (no user registered with email)
    res.render('login', {failed:true});
    */

});


// REGISTRATION
usersRouter.get('/registration', function (req, res, next) {
    res.render('registration',{emailUsed:false, loggedIn: req.cookies.login});
});

usersRouter.post('/registration', async function (req, res, next) {
    // #erneute formularbestätigung
    const {username, email, password} = req.body;
    // Encrypt user password
    const hash = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({
        username,
        email,
        password: hash,
    });
    let emailUsed = false;

    try {
        const user = await newUser.save();
        console.log("User created successfully! ");
        //## 
        res.cookie('login',user._id);
    } catch (error) {
        console.error("Error creating user:", error.message);
        emailUsed = true;
        
    }
    
    // #redirect to registration page if error otherwise home page
    if(emailUsed)
      res.render('registration', {emailUsed:true, loggedIn: req.cookies.login});
    else
      res.redirect('/');

    // show all users 
    //console.log(users);

        /*const user = { email: req.body.email, password: req.body.password, username: req.body.username }

    for (ele of users){
        if(user.email == ele.email){

            // registration failed - email already used
            res.render('registration', {emailUsed:true});
        }
    }

    users.push(user);
    */
});


// LOGOUT
usersRouter.get('/logout', function (req, res, next) {
    res.clearCookie('login');
    res.redirect('/');
});

usersRouter.get('/profile', async(req, res, next) =>{
    if(req.cookies.login){
        const user = await User.findById(req.cookies.login);
        const posts = await Post.find({ownerId: user._id});
        res.render('profile', {user: user, posts: posts, accountError: false, loggedIn: req.cookies.login, postError: false});
    }
    else
      res.render('login',{failed:false, loggedIn: req.cookies.login});
});

usersRouter.post('/users/update/:id', async(req, res, next)=>{
    const filter = {_id: req.params.id};
    const newUser = {};
    for(let prop in req.body){
        if(req.body[prop]) 
          newUser[prop] = req.body[prop];
    }
    //console.log(newUser);
    try {
        await User.findByIdAndUpdate(filter, newUser);
        res.redirect('back');
    } catch (error) {
        const user = await User.findById(req.cookies.login);
        const posts = await Post.find({ownerId: user._id});
        if(error.codeName == 'DuplicateKey')
          res.render('profile', {user: user, posts: posts, accountError: "This email already exists", loggedIn: req.cookies.login, postError: false});
        else
          res.render('profile', {user: user, posts: posts, accountError: "Something went wrong try again", loggedIn: req.cookies.login, postError: false});
    }  
});



module.exports = usersRouter;



