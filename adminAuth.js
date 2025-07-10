
require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_TOKEN_ADMIN = process.env.ADMIN_SECRET_TOKEN;

function adminAuth(req,res,next){
   try{
        const token = req.headers.token;
        const decodeToken = jwt.verify(token,JWT_TOKEN_ADMIN);

        if(decodeToken){
            req.userid = decodeToken.userId
            next();
        }else{
            message:" you are not sign in "
        }
   }catch(e){
        message: "Invalid token";
        error:e.message
   }

}

module.exports ={
    adminAuth
}