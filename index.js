require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const {userRouter} = require("./routes/user.js");
const {adminRouter} = require("./routes/admin.js");
const {courseRouter} = require("./routes/course.js");

console.log(process.env.MONGO_URL)



const app = express();
app.use(express.json());


app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/course',courseRouter);



async function main(){
   await mongoose.connect(process.env.MONGO_URI);    
    app.listen(3000);
    console.log("listening in the port 3000");
}
main()
