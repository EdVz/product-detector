import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    brand: String,
    weight: Number,
    price: Number,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;