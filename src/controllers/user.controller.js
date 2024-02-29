import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser=asyncHandler(async(req,res)=>{
    //get user details
    //validation-not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const {fullName, email, username, password}=req.body
    console.log("email:", email);

    /*
    naive code:
    implement this function separately for each of the fields

    if(fullName===""){
        throw new ApiError(400, "fullname is required")
    }
    */

    if([fullName, email, username, password].some((field)=>
    field?.trim()===""))
    {
        throw new ApiError(400, "All field are required")
    }


    //check for existing user
    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }
    //check for images, avatar
    const avatarLocalPath=req.files?.avatar[0]?.path;

    //kyuki ye check nhi ho rha alag se error ke liye, traditional method follow kro, wrna isme undefined error ayega kyuki wo field missing bhi ho skta hai
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0)
    {
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required 1")
    }

    //upload on cloudinary and check
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required 2")
    }

    //send data to database
    const user=await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //check for user creation
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //api-response

    /*
    without (util)
    return res.status(201).json(
        {
            createdUser
        }
    )*/

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registred successfully")
    )
})

export {registerUser}