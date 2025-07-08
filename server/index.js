import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";



dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","PATCH", "DELETE"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

const server = app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})