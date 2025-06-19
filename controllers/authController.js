import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";

import { generateToken, verifyToken } from "../services/JwtService.js";
import { validationResult } from "express-validator";

const registerController = async (req, res, next) => {
    try {
        const result=validationResult(req);
        if(!result.isEmpty()){
            throw createHttpError(400, result.array()[0].msg);
        }
        const { firstName, lastName, email, password, role } = req.body;
        const userExist = await User.findOne({ email });
        // if (userExist) return res.status(409).json({ message: "Email Already Exist" })
        if (userExist) throw createHttpError(409, "Email Already Exist")

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({ message: "You are registered Successfully" })


    } catch (error) {
        // res.status(500).json({ message: "internal server error", error: error.message })
        next(error)
    }
}

const loginController = async (req, res, next) => {
    try {
        const result=validationResult(req);
        if(!result.isEmpty()){
            throw createHttpError(400, result.array()[0].msg);
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) throw createHttpError(401, "Invalid email or password")

        //  user.password is hashed PW saved in db
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw createHttpError(401, "Invalid email or password")

        // token generate karne ka code hai
        // ye hamara payload hai....user data ka data token may save karenge
        const userData = {
            userId: user._id,
            role: user.role
        }
        const token = generateToken(userData);

        //    const decode= verifyToken(token);
        //    console.log(decode)


        res.json({ token })


    } catch (error) {
        next(error)
    }
}

const profileController = async (req, res, next) => {
    const id = req.user._id;
    // console.log(id,"coming from token..from isAuthenticated")
    try {

        const userId = req.params.id
        //    console.log(userId,"user id")
        if (id !== userId) throw createHttpError(401, "Unauthorized")
        const user = await User.findById({ _id: userId }).select(" -password -__v -createdAt -updatedAt")
        res.json(user)
    } catch (error) {
        next(error)
    }
}

const updateProfileController = async (req, res, next) => {
    const id = req.user._id;
    // console.log(id)
    try {
        const result=validationResult(req);
        if(!result.isEmpty()){
            throw createHttpError(400, result.array()[0].msg);
        }
        const {firstName, lastName, email}=req.body;
        const user= await User.findById(id);
        if(!user) throw createHttpError(404,"User Not found");
// if we want to update email and new email is not equal to saved email
//then only 
        if(email && email !== user.email){
          const ExistUser= await User.findOne({email})
          if(ExistUser) throw createHttpError(409,"Email is Already Used by Another User")
        }
        // console.log(user);
        if(firstName) user.firstName= firstName;
        if(lastName) user.lastName= lastName;
        if(email) user.email= email;
        await user.save();
        res.json({ 
            message: "Update Profile Succeessfully",
            user:{
                fullName:`${user.firstName} ${user.lastName}`,
                email: user.email,
                id:user._id,
                role:user.role
            }
         })
    } catch (error) {
        next(error)
    }
}

const protectedController= (req,res,next)=>{
    res.json({message:"You can access it."})
}

export { registerController, loginController, profileController, updateProfileController, protectedController }