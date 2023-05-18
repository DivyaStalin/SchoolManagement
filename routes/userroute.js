const UserSchema = require("../models/usermodel");
const { Router } = require('express');
const bcrypt = require('bcrypt');
const route = require('express').Router();
const ejs = require('ejs');
const { mailsending } = require('../middleware/mailer');
const jwt = require('jsonwebtoken');



route.post("/register",async (req,res)=>{
    try{
    console.log("user body",req.body);
     let userName = req.body.userName;
     let email = req.body.email;
     let password = req.body.password;
     let cpassword = req.body.cpassword;
     let dob = req.body.dob;
     let mobileNo = req.body.mobileNo;
     let gender = req.body.gender;
     let country = req.body.country;
     let state = req.body.state;
     
     let role = req.body.role;
     let port = 4000;

     const mailData = {
        to:email,
        subject:"verify email",
        text:"Hello",
     fileName:"verification.ejs",
        details:{
            name:userName,
            date:new Date(),
            link:`http://localhost:${port}/user/email-verify?userName=${userName}`,
        },
    };

    let mailresult = mailsending(mailData);
    if(!mailresult){
        console.log("mail not sending");
    }else{
        console.log("email sent");
        const user =  UserSchema(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = bcrypt.hashSync(password,salt);
    
        const result = await user.save();
        if(result){
            res.send({success:"Check your mail"});
        }
            else {
            return res.status(400).json({status: false,message:"failed",});
        }
    }    
    }catch(err){
        console.log("Error",err);
    }
});

route.get('/email-verify',async(req,res)=>{
    try{
        let userName = req.query.userName;
        let user = await UserSchema.findOne({userName:userName}).exec();
        if(user)
        {    
            let data ={
                userName : req.body.userName
            }
            
            if(user.verified != 'true'){
                let update = await UserSchema.updateOne(
                    {userName:userName},
                    {verified:true},
                    {new:true}).exec();
                res.render("verifyemail",{title:"Your account is  verified successfully"});
        }else{
            res.render("verifyemail",{title:`${userName} account is already verified`});
        }
        }else{
            res.render("verifyemail",{title:"Verification is failed"});
        }

    }catch(err){
        console.log("Email-Verification Error",err);
    }
});

route.post('/login',async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let userdetails;
    const user = await UserSchema.findOne({email:email}).select("-email-_id").exec();
    if(email){
         userdetails = await UserSchema.findOne({email:email}).exec();

      if(userdetails){
            let match = await bcrypt.compare(password,userdetails.password);
            let payload = { uuid:userdetails.uuid,role:userdetails.role};
            if(match){
                let userdetails = user.toObject();
                let jwttoken = jwt.sign(payload,process.env.secretkey);
                userdetails.jwttoken = jwttoken;
                 
                
                await UserSchema
                .findOneAndUpdate(
                    {email:email},
                    {loginstatus:true},
                    {new:true})
                .exec();
                res.render("home",{success:"LogIn Successfully "});
            }
            else{
                res.render("home",{success:"password doesnot match"});
                
            }
        }
        else{
            res.render("login",{success:"Usernot found"});}
    }
    else{
        res.render("login",{success:"Enter Email Id"});
    }
});


module.exports=route;