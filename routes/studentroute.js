const studentSchema = require("../models/studentmodel");
const { Router } = require('express');
const express = require('express');
const sturouter = require('express').Router();
const attendanceSchema = require('../models/attendancemodel')

sturouter.post('/att',async(req,res)=>{
    try{
           console.log(req.body);
          
          const standard = await studentSchema.find({standard:req.body.standard}).exec();
          if(standard){
            standard.forEach(async(element) => {
                console.log("standard",element);
                var  stuatt = new attendanceSchema({
            month : req.body.month,
            date :req.body.date,
            stuID:element._id,
            attendance : req.body.attendance,
          }
          
            );

            const result = await stuatt.save();
                if(result){
                    res.render('message',{success:'Success'})
            //res.status(200).json({result:result});
            console.log('success',result);
          }else{
            //res.status(400).json({result:'failed'});
            console.log('failed');
          }

            });
            
          
        }else{
            res.status(400).json({result:'std failed'})
        }
        
    }catch(err){
         console.log("Error",err);
    }
});

sturouter.get("/class",async(req,res)=>{
    try{
    const result=await studentSchema.find().populate('attendance');
    if(result){
        res.status(200).json({result:result});
    }else{
        res.status(400).json({result:'failed'});
    }
}catch(err){
    console.log("error",err);
}
})


sturouter.get('/pre',async(req,res)=>{
    try{
        let stuID = req.query.stuID;
        const present = await attendanceSchema.findOne({stuID:stuID}).exec();
        if(present){
            const result = await attendanceSchema.findOneAndUpdate({stuID:stuID},{attendance:'present'},{new:true});
            res.status(200).json({result:"success"})
        }else{
            res.status(400).json({result:'failed'});
        }

    }catch(err){
        console.log('Error',err);
    }
})

sturouter.get('/abs',async(req,res)=>{
    try{
        let stuID = req.query.stuID;
        const present = await attendanceSchema.findOne({stuID:stuID}).exec();
        if(present){
            const result = await attendanceSchema.findOneAndUpdate({stuID:stuID},{attendance:'absent'},{new:true});
            res.status(200).json({result:"success"})
        }else{
            res.status(400).json({result:'failed'});
        }

    }catch(err){
        console.log('Error',err);
    }
})

sturouter.get("/check",async(req,res)=>{
    try{
        let standard = req.query.standard;
        let result = await studentSchema.find({standard:standard}).exec();
        if(result.length>=10){
            res.send(`<script>alert("Total no of students is ${result.length}..in class ${standard}...Only 10 students are allowed")</script>`);
            
        }else{
            res.render("studentregistration",{result});
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
        let count = await studentSchema.find().count();
        res.render("search",{result,count});
        
        
    }
        catch(err){
            console.log(err);
        }
});

sturouter.get('/searchByName', async(req,res)=>{
    try{
        let result = await studentSchema.find({Name:{$regex:`^${req.query.Name}`,$options:'i'}});
        let count = await studentSchema.find({Name:{$regex:`^${req.query.Name}`,$options:'i'}}).count();
        res.render("search",{result,count});
        console.log(count);
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
    let count = await studentSchema.find({$or:[{
        standard:{$regex:`^${req.query.standard}`,$options:'i'},
        }]
}).count();
    res.render("search",{result,count});
        }catch(err){
        res.status(400).json({status:false,message:err.message});
      console.log(err.message);
    }  
}); 

sturouter.get("/deleteStudent/:Name",async (req,res)=>{
    
    
    const User = await studentSchema.findOneAndDelete({Name:req.params.Name}).exec();
    
    if(User){
        res.render("message",{success:`Success!!! ${req.params.Name} deleted successfully`});
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
            
            res.render("message",{success:`Success!!! ${stuID} updated successfully`});
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

});

sturouter.get("/attendance",async(req,res)=>{
    try{
        let result = await studentSchema.find({$or:[{
            standard:{$regex:`^${req.query.standard}`,$options:'i'},
            }]
        });
        let count = await studentSchema.find({$or:[{
            standard:{$regex:`^${req.query.standard}`,$options:'i'},
            }]
        }).count();
        
        let precount = await attendanceSchema.find({attendance:'present'}).count();
        let abscount = await attendanceSchema.find({attendance:'absent'}).count();
        res.render("attendance",{result,count,precount,abscount});

        
    }
        catch(err){
            console.log(err);
        }
});




module.exports = sturouter;
