import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";



dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;
// console.log(databaseUrl)


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","PATCH", "DELETE"],
    credentials: true
}))

app.use("/uploads/profiles",express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

const server = app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})

mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("connected to the MongoDB ");
}).catch((err)=>{
    console.log(err);
})