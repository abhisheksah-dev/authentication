//bcrypt is used to hash the password
//jwt is used to generate the token

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";
dotenv.config();


export const register=async(req,res)=>{
  //we are taking email,password and name from form or body
  const {name,email,password}=req.body;
  if(!name || !email || !password){
    return res.status(400).json({success:false,message:"All fields are required"});
  }

   try {
    //check if user already exists by the email
    const existingUser=await userModel.findOne({email});
    
    //if user already exists than dont create new user
    if(existingUser){
      return res.status(400).json({success:false,message:"User already exists"});
    }

    //if this is new user than hash the password before storing for security reason
    const hashedPassword=await bcrypt.hash(password,10);

    //creating a new user
    const user=new userModel({name,email,password:hashedPassword})

    //save the user
    await user.save();
    
    //generate token for authentication for new user
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

    res.cookie('token',token,{
      httpOnly:true,
      secure:  process.env.NODE_ENV === 'production',
      sameSite:process.env.NODE_ENV !== 'production' ? 'none' : 'strict',
      maxAge:7*24*60*60*1000
    })

    //sending welcome email
    const mailOptions={
      from:process.env.SENDER_EMAIL,
      to:email,
      subject:"Welcome to our Abhishek's Website",
      text:`Welcome to our Abhishek's Website.Your account has been created successfully with email id: ${email}.`, 
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).json({success:true,message:"User registered successfully"});
   } catch (error) {
    res.status(402).json({success:false,message:error.message});
   }
}

//login function to see if correct user is logging in
export const login=async(req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({success:false,message:"Email and password fields are required"});
  }

  try {
    const user= await userModel.findOne({email});
    if(!user){
      return res.status(400).json({success:false,message:"User not found"});
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({success:false,message:"password is incorrect"});
    }

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

    res.cookie('token',token,{
      httpOnly:true,
      secure:  process.env.NODE_ENV !== 'production',
      sameSite:process.env.NODE_ENV !== 'production' ? 'none' : 'strict', 
      maxAge:7*24*60*60*1000
    })
    return res.status(200).json({success:true,message:"User logged in successfully"});
  }catch(error){  
    res.status(402).json({success:false,message:error.message});
  }
}

//logout function to logout the user

export const logout=async(req,res)=>{
  try { 
    res.clearCookie('token',{
      httpOnly:true,
      secure:  process.env.NODE_ENV !== 'production',
      sameSite:process.env.NODE_ENV !== 'production' ? 'none' : 'strict', 
    });
    return res.status(200).json({success:true,message:"User logged out successfully"});
  } catch (error) {
    return res.status(402).json({success:false,message:error.message});
  }
 
}

//send verification otp to  the suer email
export const sendVerifyOtp=async(req,res)=>{
  try {
    const {userId}=req.body;

    const user=await userModel.findById(userId);

    if(user.isAccountVerified){
      return res.status(400).json({success:false,message:"User is already verified"});
    }
    const otp=String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp=otp;
    user.verifyOtpExpireAt=Date.now()+24*60*60*1000;

    await user.save();
    const mailOptions={
      from:process.env.SENDER_EMAIL,
      to:user.email,
      subject:"Account Verification OTP",
      // text:`Your otp is ${otp}. verify your account using this OTP`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email),
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json({success:true,message:"verification Otp sent successfully"});
  } catch (error) {
    res.status(402).json({success:false,message:`this is error is from sendVerifyOtp function :${error.message}`});
  }
}

export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;    
    if(!userId || !otp){
      return res.status(400).json({success:false,message:"userId and otp fields are required"});
    }
    try {
      const user=await userModel.findById(userId);
      if(!user){
        return res.status(400).json({success:false,message:"User not found"});
      }
      if(user.verifyOtp==='' || user.verifyOtp!==otp){
        return res.status(400).json({success:false,message:"Invalid OTP"});
      }
      if(user.verifyOtpExpireAt<Date.now()){
        return res.status(400).json({success:false,message:"OTP expired"});
      }

      user.isAccountVerified=true;
      user.verifyOtp='';
      user.verifyOtpExpireAt=0;

      await user.save();

      return res.status(200).json({success:true,message:"email verified successfully"});
    } catch (error) {
      return res.status(402).json({success:false,message:`this is error is from verifyEmail function :${error.message}`});
    }
}

//check if the user is authenticated
export const isAuthenticated=async(req,res)=>{
  try {

    return res.status(200).json({success:true,message:"User is authenticated"});
  } catch (error) {
    return res.status(402).json({success:false,message:`this is error is from isAuthenticated function :${error.message}`});
  }
}

//send password reset otp
export const sendResetOtp=async(req,res)=>{
  const {email}=req.body;

  if(!email){
    return res.status(400).json({success:false,message:"email field is required"});
  }
  try {
    const user=await userModel.findOne({email});
    if(!user){
      return res.status(400).json({success:false,message:"User not found"});
    }

    const otp=String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp=otp;
    user.resetOtpExpireAt=Date.now()+24*60*60*1000;

    await user.save();

    const mailOptions={
      from:process.env.SENDER_EMAIL,
      to:user.email,
      subject:"Password Reset OTP",
      // text:`Your otp is ${otp}. reset your password using this OTP`,
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email),
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json({success:true,message:"Reset Otp sent successfully"});
    
  } catch (error) {
    return res.status(402).json({success:false,message:`this is error is from sendResetOtp function :${error.message}`});
  }
}

//Reset password
export const resetPassword=async(req,res)=>{
  const {email,otp,newPassword}=req.body;
  if(!email || !otp || !newPassword){
    return res.status(400).json({success:false,message:"email,otp and new password fields are required"});
  }
  try {
    const user =await userModel.findOne({email});
    if(!user){
      return res.status(400).json({success:false,message:"User not found"});
    }
    if(user.resetOtp==='' || user.resetOtp!==otp){
      return res.status(400).json({success:false,message:"Invalid OTP"});
    }
    if(user.resetOtpExpireAt<Date.now()){
      return res.status(400).json({success:false,message:"OTP expired"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;

    user.resetOtp='';
    user.resetOtpExpireAt=0;

    await user.save();

    return res.status(200).json({success:true,message:"Password reset successfully"});

  } catch (error) {
    return res.status(402).json({success:false,message:`this is error is from resetPassword function :${error.message}`});
  }
}