import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/yoacosmetics");
    console.log(">>> BD conectada!");
  } catch (error) {
    console.log(error);
  }
};
