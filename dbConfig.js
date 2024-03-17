const { MongoClient } = require("mongodb");

async function connectToMongoDB() {
    const uri = "mongodb://127.0.0.1:27017/myBlogApp";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client; // Return the connected client
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = { connectToMongoDB };