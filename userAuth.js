
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_TOKEN;

async function userAuth( req, res,next){
    try{
        const token = req.headers.token;
        //decoding the token to revert back to the object id
        const decodeToken = jwt.verify(token,JWT_SECRET);
       

        if(decodeToken){
            req.userId = decodeToken.userId;
            next();
        }else{
            return res.status(404).json({
                message:"you are not sign in"
            })
        }
    }catch(e){
        return res.json({
            message: "invalid token",
            error:e.message
        })
    }

}

module.exports={
    userAuth
}