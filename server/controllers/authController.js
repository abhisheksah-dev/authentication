//bcrypt is used to hash the password
//jwt is used to generate the token

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


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
      secure:  process.env.NODE_ENV !== 'production',
      sameSite:process.env.NODE_ENV !== 'production' ? 'none' : 'strict',
      maxAge:7*24*60*60*1000
    })
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
      return res.status(400).json({success:false,message:"Invalid credentials"});
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