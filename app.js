const express = require('express');
const app = express();
var ejs = require("ejs");
const usersRouter = require('./routes/usersRoutes');
const postsRouter = require('./routes/postsRoutes');
const port = 80;
app.listen(port, () => {
    console.log('Your Server is running on port: ' +port);
})

//EJS Engine
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRouter);
// app.use(postsRouter);