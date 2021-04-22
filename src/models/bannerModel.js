const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    nameFile: { type: String, required: true},
    nameNew: { type: String, required: true }
},{
    timestamps: true
});

const Banner = mongoose.model('Banners', bannerSchema);

module.exports = Banner;