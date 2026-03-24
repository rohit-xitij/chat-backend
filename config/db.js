import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gohilharsh069:Gohil123@cluster0.0umxzq9.mongodb.net/chat-app",
    );

    console.log("Database Connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
