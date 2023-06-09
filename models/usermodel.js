const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');


const userSchema = new Schema({
    uuid :{
        type:String,
        required:false
    },
    userName :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
    cpassword:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    loginStatus:{
        type:String,
        required:false,
        default:false
    },
    role:{
        type:String,
        enum:['user','admin'],
        required:true,
        default:'admin'
    },
    verified:{
        type:String,
        required:false,
        default:false
    }
},

    {
        timestamps:true,
    }

);

userSchema.pre("save",function(next){
    this.uuid = "USER-" + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase();
    next();
});



const User = mongoose.model("user",userSchema);

module.exports = User;