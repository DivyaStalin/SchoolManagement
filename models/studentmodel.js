const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');


const studentSchema = new Schema({
    uuid :{
        type:String,
        required:false
    },
    stuID:{
        type:String,
        required:true
    },
    Name :{
        type:String,
        required:true
    },
    fatherName :{
        type:String,
        required:true
    },
    motherName :{
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
    address:{
        type:String,
        required:true,
    },
    standard:{
        type:String,
        required:false  
    },
    gender:{
        type:String,
        required:false  
    },
    
},
    {
        timestamps:true,
    }

);

studentSchema.pre("save",function(next){
    this.uuid = "STU-" + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase();
    next();
});



const Student = mongoose.model("student",studentSchema);
module.exports = Student;