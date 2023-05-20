const studentSchema = require("../models/studentmodel");
const { Router } = require('express');
const express = require('express');
const sturouter = require('express').Router();

sturouter.post("/studentregister",async (req,res)=>{
    try{
    console.log("user body",req.body);

    let stuInfo = {
        stuID : req.body.stuID,
         Name : req.body.Name,
         fatherName : req.body.fatherName,
         motherName:req.body.motherName,
         mobileNo: req.body.mobileNo,
         aadharNo: req.body.aadharNo,
         standard : req.body.standard,
         address : req.body.address,
         gender : req.body.gender
    }
         
        const student =  studentSchema(stuInfo);
           
           const result = await student.save();
           if(result){
             return res.status(200)
             .json({
               status:true,
               message:'success',
               result:result});
           }
            else {
               return res.status(400)
               .json({
                   status: false,
                   message:"failed",});
            }
        
    }     
        
    catch(err){
        console.log("Error",err);
    }
});

sturouter.get('/getallstudent', async(req,res)=>{
    try{
        let result = await studentSchema.find().exec();
        res.render("search",{result});
        console.log(result);
    }
        catch(err){
            console.log(err);
        }
});

sturouter.get('/searchByName', async(req,res)=>{
    try{
        let result = await studentSchema.find({Name:{$regex:`^${req.query.Name}`,$options:'i'}})
        res.render("search",{result});
    }catch(err){
      console.log("err");
    }
}); 
sturouter.get('/searchByStandard', async(req,res)=>{
    try{
        let result = await studentSchema.find({$or:[{
            standard:{$regex:`^${req.query.standard}`,$options:'i'},
            }]
    });
    res.render("search",{result});
        }catch(err){
        res.status(400).json({status:false,message:err.message});
      console.log(err.message);
    }  
}); 

module.exports = sturouter;
