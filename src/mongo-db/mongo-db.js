const mongodbUri = process.env.MONGODB_URI;
const mongoose = require('mongoose');

const connect = async () => {
    await mongoose.connect(mongodbUri, { useNewUrlParser: true });
}

const disconnect = async () => {
    await mongoose.disconnect();
}

module.exports = { connect, disconnect }