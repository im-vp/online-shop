import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connection.asPromise();
  }

  return await mongoose.connect(process.env.MONGODB_URI as string, {
    dbName: 'online-shop',
  });
};
