const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const options = {
"caseSensitive": false,
"strict": false
};

const usersRouter = express.Router(options);

const User = require("../models/User");


// USER STORAGE
//let users = [{email: 's@d', password: 's'}];

// for bCrypt
const saltRounds = 7;

// LOGIN
usersRouter.get('/login', function (req, res, next) {
    res.render('login',{failed:false});
});

usersRouter.post('/login', async function (req, res, next) {
    // #erneute formularbestätigung
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && bcrypt.compareSync(password, user.password)){
        res.redirect('/');
         //## same for register
        res.cookie('login',user._id);
    }
    else{
        res.render('login', {failed:true});
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
    res.render('registration',{emailUsed:false});
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
        await newUser.save();
        console.log("User created successfully!");
        //## 
        res.cookie('login',user._id);
    } catch (error) {
        console.error("Error creating user:", error.message);
        emailUsed = true;
        
    }
    
    // #redirect to registration page if error otherwise home page
    if(emailUsed)
      res.render('registration', {emailUsed:true});
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




module.exports = usersRouter;



