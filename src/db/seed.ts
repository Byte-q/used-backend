import mongoose from 'mongoose';
import { UserModel } from '../server/models/User';
import { PostModel } from '../server/models/Posts';
import { ProductModel } from '../server/models/Products';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb+srv://mohaazizz01:0122Gare@cluster0.zonvekt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  await mongoose.connect(MONGODB_URI);

//   // Seed users
  await UserModel.deleteMany({});
  await UserModel.insertMany([
    {
      username: 'admin',
      password: 'hashedpassword',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Seed posts
  await PostModel.deleteMany({});
  await PostModel.insertMany([
    {
      title: 'Sample Post',
      slug: 'sample-post',
      content: 'This is a sample post content.',
      authorId: 'admin', // Assuming admin user exists
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Seed products
  await ProductModel.deleteMany({});
  await ProductModel.insertMany([
    {
      title: 'Sample Product',
      description: 'This is a sample product description.',
      price: 100,
      stock: 50,
      imageUrl: 'https://example.com/sample-product.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('Seeding done!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

