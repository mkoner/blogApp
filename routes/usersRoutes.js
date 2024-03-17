const express = require('express');
const path = require('path');

const { error } = require('console');
const options = {
"caseSensitive": false,
"strict": false
};

const usersRouter = express.Router(options);



// USER STORAGE
let users = [{email: 's@d', password: 's'}];

// LOGIN
usersRouter.get('/login', function (req, res, next) {
    res.render('login',{failed:false});
});

usersRouter.post('/login', function (req, res, next) {
    // #erneute formularbestätigung
    let user = { email: req.body.email, password: req.body.password }

    for (ele of users){
        if(user.email == ele.email){
            if(user.password == ele.password)
                // #redirect
                res.redirect('/');

            // login failed (wrong password)
            res.render('login', {failed:true});
        }
    }

    // login failed (no user registered with email)
    res.render('login', {failed:true});
});


// REGISTRATION
usersRouter.get('/registration', function (req, res, next) {
    res.render('registration',{emailUsed:false});
});

usersRouter.post('/registration', function (req, res, next) {
    // #erneute formularbestätigung
    let user = { email: req.body.email, password: req.body.password, username: req.body.username }

    for (ele of users){
        if(user.email == ele.email){

            // registration failed - email already used
            res.render('registration', {emailUsed:true});
        }
    }

    users.push(user);
    // #redirect
    res.redirect('/');

    // show all users 
    console.log(users);
});




module.exports = usersRouter;



