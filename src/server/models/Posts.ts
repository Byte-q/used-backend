import mongoose, { Document, Model } from 'mongoose';

export const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        required: false,
    },
    authorId: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    isFeatured: {
        type: Boolean,
        required: false,
    },
    views: {
        type: Number,
        required: false,
    },
    metaTitle: {
        type: String,
        required: false,
    },
    metaDescription: {
        type: String,
        required: false,
    },
    metaKeywords: {
        type: String,
        required: false,
    },
    focusKeyword: {
        type: String,
        required: false,
    },
    categoryId: {
        type: String,
        required: false,
    },
    readTime: {
        type: Number,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false,
    },

})

export interface IPost {
    _id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    authorId: string;
    status: string;
    imageUrl?: string;
    isFeatured?: boolean;
    views?: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    focusKeyword?: string;
    categoryId?: string;
    readTime?: number;
    createdAt?: Date;
    updatedAt?: Date;
  };

  type PostDocument = IPost & Document;
  export const PostModel: Model<PostDocument> = mongoose.model<PostDocument>('posts', PostSchema);
