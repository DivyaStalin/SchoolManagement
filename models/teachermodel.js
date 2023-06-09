const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');


const teacherSchema = new Schema({
    uuid :{
        type:String,
        required:false
    },
    empID:{
        type:String,
        required:true
    },
    firstName :{
        type:String,
        required:true
    },
    lastName :{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    aadharNo:{
        type:String,
        required:true,
    },
    qualification:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true  
    },
    salary:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        required:false,
        enum:['active','inactive'],
        default:'inactive'
    },
    onPeriod:{
        type:String,
        required:false,
        enum:['on','off'],
        default:'off'
    }
},
    {
        timestamps:true,
    }

);

teacherSchema.pre("save",function(next){
    this.uuid = "TEAC-" + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase();
    next();
});



const Teacher = mongoose.model("teacher",teacherSchema);

module.exports = Teacher;