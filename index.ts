import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const envConfig = dotenv.config();
if (envConfig.error) {
  throw envConfig.error;
}

const PORT: number = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

const app = express();

app.get("/", (req: Request, res: Response) => { 
  res.status(200).send("Hello World");
}); 

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => { 
      console.log(`Server running at PORT: ${PORT}`); 
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();