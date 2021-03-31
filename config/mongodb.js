const mongoose  = require('mongoose');
const dotEnv    = require('dotenv');

dotEnv.config();

try {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        bufferMaxEntries: 0
    });
} catch (error) {
    throw error;
}

module.exports = mongoose;