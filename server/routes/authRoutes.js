import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter=express.Router();

//here you have given /register but in server.js file you have use /api/auth than you have called the authRouter so the register willopen when you will go to http://localhost:4000/api/auth/register and not on http://localhost:4000/register 

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);

//userAuth middleware is used to check if user is logged in or not
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);

//userAuth middleware is used to check if user is logged in or not
authRouter.post('/verify-account',userAuth,verifyEmail);

//userAuth middleware is used to check if user is logged in or not
authRouter.get('/is-auth',userAuth,isAuthenticated);

//reset password
authRouter.post('/send-reset-otp',sendResetOtp);

authRouter.post('/reset-password',resetPassword);


export default authRouter;