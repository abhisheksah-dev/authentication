import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();
const app=express();
const port=process.env.PORT || 4000;
connectDb();
app.use(express.json());
app.use(cors({credentials : true}));
app.use(cookieParser());

//API endpoints
app.get("/", (req, res) => {
  res.send("Hello new World!");
});
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});