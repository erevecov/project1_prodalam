const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = mongoose.Schema;

const infoSchema = new Schema({
    title: { type: String, required: true},
    address: { type: String, required: true},
    phone: { type: String, required: true },
    email: { type: String, required: true},
    in_charge: { type: String, required: true },
    src: { type: String, required: true },
},{
    timestamps: true
});

infoSchema.plugin(mongoosePaginate)

const Info = mongoose.model('Infos', infoSchema);

module.exports = Info;