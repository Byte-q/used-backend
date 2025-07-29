// MongoDB-compatible schema and types for all entities
import { z } from 'zod';

// User
export interface User {
  _id?: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  imageUrl?: string;
  role: string;
  createdAt: Date;
}
export const userSchema = z.object({
  _id: z.string().optional(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  imageUrl: z.string().optional(),
  role: z.string().default('user'),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});
export const insertUserSchema = userSchema.omit({ _id: true, createdAt: true });

// Product
export interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const productSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().default(0),
  imageUrl: z.string().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export const insertProductSchema = productSchema.omit({ _id: true, createdAt: true });

export interface Post {
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

export const postSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  authorId: z.string(),
  status: z.string(),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  views: z.number().default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  focusKeyword: z.string().optional(),
  categoryId: z.string().optional(),
  readTime: z.number().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});
export const insertPostSchema = postSchema.omit({ _id: true, createdAt: true, updatedAt: true });