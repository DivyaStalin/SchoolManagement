const teacherSchema = require("../models/teachermodel");
const { Router } = require('express');

const router = require('express').Router();




router.post("/teacherregister",async (req,res)=>{
    try{
    console.log("user body",req.body);
     let empID = req.body.empID;
     let firstName = req.body.firtName;
     let lastName = req.body.lastName;
     let email=req.body.email;
     let mobileNo= req.body.mobileNo;
     let aadharNo= req.body.aadharNo;
     let qualification = req.body.qualification;
     let subject = req.body.subject;
     let salary = req.body.salary;

     const teacher =  teacherSchema(req.body);
        
        const result = await teacher.save();
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
    }catch(err){
        console.log("Error",err);
    }
});
router.get('/searchTeacher', async(req,res)=>{
    try{
        let result = await teacherSchema.find({firstName:{$regex:`^${req.query.firstName}`,$options:'i'}})
        res.render("searchTeacher",{result});
    }catch(err){
      console.log("err");
    }
});
router.delete("/deleteTeacher",async (req,res)=>{
    let firstName = req.query.firstName;
    
    const User = await teacherSchema.findOne({firstName:firstName}).exec();
    
    if(User){
        const deleteuser = await teacherSchema.deleteOne({firstName:firstName}).exec();

        res.status(200).json({
            status:true,
            message:"deleted successfully",
        });
    }else{
        res.status(400)
        .json({status:false,
        message:"No user found",
    });
    }
});

module.exports = router;
