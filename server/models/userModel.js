//user model file is used to create user model means what will be the structure of the user

import mongoose from "mongoose";

//default is assigned to some field it does not mean that it is not required it is defualt because it is not required during the main account creation but are required during other operations after account creation
const userSchema=new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verifyOtp:{
    type:String,
    default:''
  },
  verifyOtpExpireAt:{
    type:Number,
    default:0
  },
  isAccountVerified: {
    type: Boolean, 
    default: false
  },
  resetOtp:{
    type:String,
    default:''
  },
  resetOtpExpireAt:{
    type:Number,
    default:0
  }
}, {
  timestamps: true
});

//we are using this or line mongoose.models.user as if we dont use it than it will again and again create user model
const userModel=mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;