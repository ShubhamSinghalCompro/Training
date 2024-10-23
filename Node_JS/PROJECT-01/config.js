const mongoose = require('mongoose');


// Connect to MongoDB
async function connectMongoDB(url) {
    return mongoose.connect(url);
}


module.exports = {
    connectMongoDB
};