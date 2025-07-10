const { Router } = require("express");
const { userAuth } =require("../middlewares/userAuth");
const { purchaseModel} = require("../db");

const courseRouter = Router();

courseRouter.post("/purchase",userAuth, async(req,res)=>{
    try{
        const userId = req.userId;
    const courseId = req.body.courseId  
    
    await purchaseModel.create({
        userId,
        courseId
    })
    res.status(200).json({
        message: "purchased course successfully"
    })


    }catch(e){
        res.json({
            error:e.message
        })
    }
})

courseRouter.get("/preview",async(req,res)=>{
 
    const courses = await purchaseModel.find({});
    
    res.json({
        message: "all courses",
        courses
    })
 })
     

module.exports = {
    courseRouter: courseRouter
}