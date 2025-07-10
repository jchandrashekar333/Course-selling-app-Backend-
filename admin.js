require("dotenv").config()
;const mongoose = require("mongoose");
const {Router} = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { adminModel,courseModel } = require("../db");
const { adminAuth } = require("../middlewares/adminAuth");
const jwt = require("jsonwebtoken");

const adminRouter = Router();

const JWT_TOKEN_ADMIN = process.env.ADMIN_SECRET_TOKEN;




adminRouter.post("/signup",async(req,res)=>{
        const requriedAdminData = z.object({
        email:z.string().email(),
        firstname:z.string().regex(/^[A-Za-z]+$/,"firstname must conatains letters only"),
        lastname: z.string().regex(/^[A-Za-z]+$/,"lastname must conatains letters only"),
        password:z.string().min(8).max(30,"password is too long").regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)
    })

    const parseData = requriedAdminData.safeParse(req.body);

    if(!parseData.success){
        return res.json({
            message: "invalid input ",
            error:parseData.error
        })
    }
    try{
        const {email,firstname,lastname,password} = req.body;
        const hashPassword =await bcrypt.hash(password,5);


        await adminModel.create({
            email:email,
            firstname:firstname,
            lastname:lastname,
            password:hashPassword
        })
        res.status(200).json({
            message: "you are sign up"
        })

    }catch(e){
            return res.json({
                message: "something gonna wrong",
                error: e.message
            })
    }

})

adminRouter.post("/signin",async(req,res)=>{

        try{
            const { email, password} = req.body;

            const user = await adminModel.findOne({email :email});
            if(!user){
                return res.status(404).json({
                    message: "user not found with that email in db"
                })
            }

            const checkingPass =await bcrypt.compare(password,user.password);
            if(checkingPass){
                const token = jwt.sign({
                    userId:user._id
                },JWT_TOKEN_ADMIN)
                
                return res.status(200).json({
                    token
                })

            }
        }catch(e){
                return res.json({
                    message:"invalid signin details",
                    error:e.message
                })
            }
    })

adminRouter.post("/course",adminAuth,async(req,res)=>{

        try{
            const adminId = req.userId;

            const { title, description,price,imageURL,courseId} = req.body;

            await courseModel.create({
                title:title,
                description:description,
                price:price,
                imageURL:imageURL,
                courseId:adminId
            })
            res.status(200).json({
                message:"course created successfully",
                 courseId
            })



        }catch(e){

            res.json({
                error: e.message
            })

        }
   })

adminRouter.put("/course",adminAuth, async(req,res)=>{
   try{
        const adminId = req.userId
        const { title, description, price,imageURL,courseId} = req.body

        await courseModel.updateOne({
            _id:courseId,
            createrId:adminId
        },
            
            {
            title:title,
            description:description,
            price:price,
            imageURL:imageURL,
            courseId: adminId
        })
        res.status(200).json({
            message: "cousre is updated",
            courseId
        });
        
    }catch(e){
        res.status(404).josn({
            message:" something went wrong",
            error:e.message
        })
    }


})

adminRouter.get("/course/all",adminAuth,async(req,res)=>{

        const adminId = req.userId;

        const courses = await courseModel.findOne({
            creatorId:adminId
        })
        res.status(200).json({
            message:"you got all courses of admin",
            courses
        })

})

 module.exports = {
     adminRouter: adminRouter
 }
