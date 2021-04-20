const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = mongoose.Schema;

const productSchema = new Schema({
    sku: { type: String, required: true },
    productId: { type: Number, integer: true, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    subCategory2: { type: String },
    description: { type: String, required: true },
    use: { type: String },
    benefits: { type: String },
    star: { type: String, required: true, default: 'no' },
    status: { type: String, required: true, default: 'enabled' },
    info: [{
        name: {type: String, required: true},
        data: {type: String, required: true}
    }],
}, {
    timestamps: true
});

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model('Products', productSchema);

module.exports = Product;