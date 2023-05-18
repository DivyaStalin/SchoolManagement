const studentSchema = require("../models/studentmodel");
const { Router } = require('express');
const express = require('express');
const sturouter = require('express').Router();

sturouter.post("/studentregister",async (req,res)=>{
    try{
    console.log("user body",req.body);

    let stuInfo = {
        stuID : req.body.stuID,
         Name : req.query.Name,
         fatherName : req.body.fatherName,
         motherName:req.body.motherName,
         mobileNo: req.body.mobileNo,
         aadharNo: req.body.aadharNo,
         standard : req.query.standard,
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
        const allstu = await studentSchema.find().exec()
        
            res.send({result:allstu})
            console.log(allstu);
        }
        catch(err){
            console.log(err);
        }
});

sturouter.get('/searchByName', async(req,res)=>{
    try{
        let queryObj={...req.query};
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace((match)=>`$${match}`);
        let result = await studentSchema.find(JSON.parse(queryStr));
        res.status(200).json({
            status:true,
            message:"success",
            result:result
        });
    }catch(err){
      console.log("err");
    }
}); 
sturouter.get('/searchByStandard', async(req,res)=>{
    try{
        let keyword = req.query.standard;
        let data = await studentSchema.find({
            "$or":[{standard:{$regex:req.query.keyword}}]
        }).exec();
        if(data)
             res.status(200).json({status:true,message:'success',result:data});
        }catch(err){
        res.status(400).json({status:false,message:err.message});
      console.log(err.message);
    }  
}); 

module.exports = sturouter;
