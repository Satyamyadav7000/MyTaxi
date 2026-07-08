import mongoose from "mongoose";

// Disable command buffering so queries fail immediately if DB is not connected,
// rather than hanging the API request forever.
mongoose.set('bufferCommands', false);

function connect() {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Fail fast (5 seconds instead of 30 seconds)
    })
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(err => {
            console.log("MongoDB connection error:", err.message);
        })
}

export default connect;