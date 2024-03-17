const express = require('express');
const app = express();
var ejs = require("ejs");
const usersRouter = require('./routes/usersRoutes');
const postsRouter = require('./routes/postsRoutes');
const mongoose = require('mongoose');

const port = 80;


//EJS Engine
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRouter);
app.use(postsRouter);
//console.log(dbClient);

const newPost = {
    title: 'My new blog post',
    content: 'This is some awesome content!'
};


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

/*
const User = require("./models/user");

async function createUser() {
    const newUser = new User({
        username: "john_doe",
        email: "john@example.com",
        password : "1234"
    });

    try {
        await newUser.save();
        console.log("User created successfully!");
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

createUser();

const Post = require("./models/post");

async function createPost() {
    const newPost = new Post({
        ownerId: "65f73cb670a704ac2ca7caf0",
        postedDate: new Date(),
        title : "1234",
        content: "okayy",
        imageUrl: "é"
    });

    try {
        await newPost.save();
        console.log("Post created successfully!");
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

createPost();
*/
