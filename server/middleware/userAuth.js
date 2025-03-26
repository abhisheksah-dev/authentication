 import jwt from "jsonwebtoken";
 import dotenv from "dotenv";
 dotenv.config();
 const userAuth = async (req, res, next) => {
  const {token}=req.cookies;

  if(!token){
    return res.status(401).json({success:false,message:"Unauthorized access Login Again"});
  }
  try {
    const tokenDecoded=jwt.verify(token,process.env.JWT_SECRET);
    if(tokenDecoded.id){
      req.body.userId=tokenDecoded.id;
    }else{
      return res.status(401).json({success:false,message:"Unauthorized access Login Again"});
    }
    next(); 
  } catch (error) {
    return res.status(401).json({success:false,message:`Unauthorized access Login Again :${error.message}`});
  }
 }

 export default userAuth;