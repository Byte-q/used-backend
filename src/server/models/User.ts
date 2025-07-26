import { unique } from 'drizzle-orm/mysql-core';
import mongoose, { Document, Model } from 'mongoose';
import { _ } from 'vitest/dist/chunks/reporters.d.BFLkQcL6';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export interface IUser {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  type UserDocument = IUser & Document;
  export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);