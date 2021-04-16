const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = mongoose.Schema;

const productSchema = new Schema({
    sku: { type: String, required: true},
    title: { type: String, required: true},
    category: { type: String, required: true},
    categoryFather: { type: String, required: true},
    productId: {type: Number, integer: true, required: true},
    info: [{
        id: {type: Number, integer: true, required: true},
        attributeId: {type: Number, integer: true, required: true},
        attributeLabel: {type: String, required: true},
        data: {type: String, required: true}
    }],
    status: { type: String, required: true, default: 'enabled' }
},{
    timestamps: true
});

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model('Products', productSchema);

module.exports = Product;