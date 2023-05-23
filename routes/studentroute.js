const studentSchema = require("../models/studentmodel");
const { Router } = require('express');
const express = require('express');
const sturouter = require('express').Router();
sturouter.get("/check",async(req,res)=>{
    try{
        let standard = req.query.standard;
        let check = await studentSchema.find({standard:standard}).exec();
        if(check.length>=10){
            res.send(`<script>alert("Total no of students is ${check.length}..in class ${standard}...Only 10 students are allowed")</script>`);
            
        }else{
            res.render("studentregistration");
        }

    }catch(err){
        console.log("Error",err);
    }
})
sturouter.post("/studentregister",async (req,res)=>{
    try{
    
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
            res.render("message",{success:`Success!!! ${req.body.firstName} your details are registered`})
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

sturouter.get("/deleteStudent/:Name",async (req,res)=>{
    
    
    const User = await studentSchema.findOneAndDelete({Name:req.params.Name}).exec();
    
    if(User){
        res.render("message",{success:`${req.params.Name} deleted successfully`});
    }else{
        res.status(400)
        .json({status:false,
        message:"No user found",
    });
    }
});


sturouter.get('/editStudent/:stuID',async(req,res)=>{
    try{
    
    const result = await studentSchema.findOneAndUpdate({stuID:req.params.stuID},req.body,{new:true});
        
        if (result){
            
            res.render("editStudent",{result});
            
        
        }else{
            res.status(400).json({
                status:false,
                message:'failed'
            });
        }

    }
    catch(err){
          console.log(err);
    }

});

sturouter.post('/editStudent',async(req,res)=>{
    try{
        let stuID = req.query.stuID;
        const result = await studentSchema.findOneAndUpdate({stuID:stuID},req.body);
        
        if (result){
            
            res.render("message",{success:`${stuID} updated successfully`});
            console.log("updated successfully");
        
        }else{
            res.status(400).json({
                status:false,
                message:'fail'
            });
        }

    }catch(err){
          console.log(err);
    }

})




module.exports = sturouter;
