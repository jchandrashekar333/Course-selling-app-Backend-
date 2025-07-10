/*
- Add route skeleton for user login, signup, purchase a course, sees all courses, sees the purchased courses course
*/
require("dotenv").config();

const { Router } = require("express");
const { userModel,courseModel,purchaseModel } =require('../db');
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/userAuth");

const JWT_SECRET_USER = process.env.USER_SECRET_TOKEN;

const userRouter = Router();


userRouter.post("/signUp",async(req,res)=>{
    //zod for the input validation

    const requireduserData = z.object({
        email: z.string().email(),
        firstname:z.string().regex(/^[A-Za-z]+$/,"firstname must conatains letters only"),
        lastname:z.string().regex(/^[A-Za-z]+$/,"lastname must conatains letters only"),
        password:z.string().min(8).max(30,"password is too long").regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)
    })

    const parsedData = requireduserData.safeParse(req.body);

    if(!parsedData.success){
       return res.status(400).json({
            message: "invalid format",
            error: parsedData.error
        })
    }
    try{
        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const password = req.body.password;
        //hasing the password by adding the slt rounds make the passowrd so secure and and hard to crack 
        const hashedPassword = await  bcrypt.hash(password,5);

        await userModel.create({
            email: email,
            firstname:firstname,
            lastname:lastname,
            password: hashedPassword
        })
        res.json({
            message: "user SIGNUP successfully"
        })

    }catch(e){
        res.status(500).json({
            message:"something went wrong",
            error:e.message
        })
    }
})

userRouter.post("/signin",async(req,res)=>{
    try{
        const { email, password} = req.body;
        const user = await userModel.findOne({
            email: email
        })
        if(!user){
            return res.json({
                message: "email doensot exist in the db"
            })
        }
        const checkPass = await bcrypt.compare(password,user.password)
        if(checkPass){  
            const token = jwt.sign({
                userId: user._id
            },JWT_SECRET_USER);
            return res.status(200).json({
                token
            })
        }else{
            return res.json({
                message: "invalid password"
            })
        }

    }catch(e){
        return res.status(500).json({
            error:e.message
        })

    }

})

userRouter.get("/purchase",userAuth,async(req,res)=>{
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId
    })
    res.json({
        message:  "this all courses are purchased by the user",
        purchases
    })


x   

})

module.exports = {
    userRouter: userRouter
}