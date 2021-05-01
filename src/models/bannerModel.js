const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    nameFile: { type: String, default: ''},
    nameNew: { type: String, default: '' },
    nameFileM: { type: String, default: ''},
    nameNewM: { type: String, default: ''},
    urlBanner: { type: String, default: ''}
},{
    timestamps: true
});

const Banner = mongoose.model('Banners', bannerSchema);

module.exports = Banner;