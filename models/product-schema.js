const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_image : {
        type: String
    },
    product_price: {
        type: String,
        required: true
    },
    product_rating: {
        type: String,
        required: true,
    },
    product_descreption: {
        type: String,
        required: true,
    },
    product_category: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema); 