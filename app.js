const express = require('express');
const app = express();
const usersRouter = require('./routes/usersRoutes');
const postsRouter = require('./routes/postsRoutes');
const port = 80;
app.listen(port, () => {
    console.log('Your Server is running on port: ' +port);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRouter);
app.use(postsRouter);