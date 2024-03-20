const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    postedDate: { type: Date, required: true,  },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: {type: String, required: false},
    views: {type: Number, default: 0},
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;