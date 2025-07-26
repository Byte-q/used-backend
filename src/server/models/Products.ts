import mongoose, { Document, Model } from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: false,
    },

})

export interface IProduct {
    title: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  type ProductDocument = IProduct & Document;
  export const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>('products', ProductSchema);
