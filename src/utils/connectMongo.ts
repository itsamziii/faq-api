import mongoose from "mongoose";
import env from "../env.js";

export async function connectMongo() {
    if (!env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }
    try {
        await mongoose.connect(env.MONGO_URI);
    } catch (error) {
        throw error;
    }
}
