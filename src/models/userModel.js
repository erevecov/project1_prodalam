const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    rut: { type: String, required: true},
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    scope: { type: String, required: true },
    phone: { type: String },
    status: { type: String, required: true, default: 'enabled' }
},{
    timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = User;