const express = require('express');
const app = express();
const ejs = require("ejs");
const path = require('path');
const usersRouter = require('./routes/usersRoutes');
const postsRouter = require('./routes/postsRoutes');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");


const port = 80;


//EJS Engine
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(usersRouter);
app.use(postsRouter);
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/uploads', express.static(path.join(__dirname, 'views', 'uploads')));
app.use('/icons', express.static(path.join(__dirname, 'views', 'icons')));


// page not found
app.use((req, res, next)=>{
    res.render('404', {loggedIn: req.cookies.login});
})

app.use((err, req, res, next)=>{
    if(err.message == "Only .png, .jpg and .jpeg format allowed!")
      res.render('createPost', {failed: true, loggedIn: req.cookies.login, notImage: true})
    else
      res.render('500', {loggedIn: req.cookies.login});
})




  // connect to the mongoDB
  const uri = "mongodb://127.0.0.1:27017/myBlogApp";
mongoose.connect(uri).then(success => {

    console.log('Connected to MongoDB');
    
    // start the server
    app.listen(port, () => {
        console.log(`Server listening at : ${port}`);
    });

}).catch(error => {
    console.log('Error in Connection ' + error);
});

