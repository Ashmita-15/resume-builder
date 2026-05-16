import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);

    // DO NOT use process.exit() on Vercel
    throw error;
  }
};

export default connectDB;
