import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const authRouter=express.Router();

//here you have given /register but in server.js file you have use /api/auth than you have called the authRouter so the register willopen when you will go to http://localhost:4000/api/auth/register and not on http://localhost:4000/register 

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);

export default authRouter;