import mongoose from "mongoose";

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("Database connected successfully");

    } catch (error) {

        console.log("MongoDB Connection Error:", error.message);

        process.exit(1);
    }
};

export default connectDB;