const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    rut: { type: String, required: true},
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    scope: { type: String, required: true },
    phone: { type: String, default: ''},
    status: { type: String, required: true, default: 'enabled' }
},{
    timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = User;