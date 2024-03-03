import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


//_ is for response. in production grid, it is used if the variable res is declared but not used
export const verifyJWT=asyncHandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header("Authorisation")?.replace("Bearer ","")
    
        if(!token)
        {
            throw new ApiError(401,"Unauthorised request")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
    
        if(!user){
            throw new ApiError(401,"invalid Access Token")
        }
    
        req.user=user;
        //after mdddleware agle wale ko run kro
        next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid Access token")
    }
})