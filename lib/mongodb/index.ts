import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connection.asPromise();
  }

  return await mongoose.connect(process.env.MONGO_DB_URL as string, {
    dbName: 'online-shop',
  });
};
