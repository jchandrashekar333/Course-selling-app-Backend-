const mongoose = require("mongoose");


const schema = mongoose.Schema;
const objectId = mongoose.ObjectId;

const userSchema = new schema({
   
    email:{
        type: String,
        unique: true,
        required:true
    },
    firstname:String,
    lastname:String,
    password:{type:String, required:true},
});

const adminSchema = new schema({
    email:{
        type: String,
        unique: true,
        required:true
    },
    firstname: String, 
    lastname: String,
    password:{type:String, required:true}

});

const courseSchema = new schema({
    title: String,
    description: String,
    price: String,
    imageURL: String,
    courseId: objectId

});

const purchaseSchema = new schema({
    userId: objectId,
    courseId: objectId
})


const userModel = mongoose.model('user', userSchema);
const adminModel = mongoose.model('admin',adminSchema);
const courseModel = mongoose.model('course',courseSchema);
const purchaseModel = mongoose.model('purchase',purchaseSchema);

module.exports={
    userModel, adminModel,courseModel,purchaseModel
}