const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = mongoose.Schema;

const infoSchema = new Schema({
    title: { type: String, required: true},
    direction: { type: String, required: true},
    schedule: { type:String, required: true},
    phone: [{
        type: String, required: true
    }],
    email: { type: String, required: true},
    boss: [{
        type: String, required: true
    }]
},{
    timestamps: true
});

infoSchema.plugin(mongoosePaginate)

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;