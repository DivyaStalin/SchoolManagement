const teacherSchema = require("../models/teachermodel");
const { Router } = require('express');
const { mailsending } = require('../middleware/mailer');
const router = require('express').Router();
const {isAdmin} = require('../middleware/auth')
const nodemailer = require('nodemailer');

router.post('/teacherLogin',async(req,res)=>{
    let firstName = req.body.firstName;
    let result = await teacherSchema.find({firstName:firstName}).exec();
    if(result)
    {
    await teacherSchema.findOneAndUpdate({firstName:firstName},{onperiod:'on'},{new:true})
    res.render('message',{success:`${firstName} login success!!!!`})
    }else{
        res.status(400).json({result:'failed'});
    }
})
router.post('/teacherLogout',async(req,res)=>{
    let firstName = req.body.firstName;
    let result = await teacherSchema.find({firstName:firstName}).exec();
    if(result)
    {
    await teacherSchema.findOneAndUpdate({firstName:firstName},{onperiod:'off'},{new:true})
    res.render('message',{success:`${firstName} logout success!!!!`})
    }else{
        res.status(400).json({result:'failed'});
    }
})



router.get('/availableTeacher',async(req,res)=>{
    try{
        let onPeriod = req.query.onPeriod;
        let result = await teacherSchema.find({onPeriod:onPeriod}).exec();
        if(result){
            if(result.onPeriod != 'off'){
                res.render("availableTeacher",{result});
                //res.status(200).json({result:result})
                console.log(result);
            }else{
                console.log("Availabe teachers");
            }

        }else{
            console.log("Invalid input")
        }
    }catch(err){
         console.log("Error",err);
    }
})
router.get('/status',async(req,res)=>{
    let result = await teacherSchema.find().exec();
    res.render("teacherStatus",{result});
})

router.get('/statusChange',async(req,res)=>{
    let result = await teacherSchema.find().exec();
    res.render("teacherAtt",{result});
})

router.get('/present',async(req,res)=>{
    try{
        const result = await teacherSchema.find({empID:req.query.empID}).exec();
        
        if (result){
            let result = await teacherSchema.updateOne({empID:req.query.empID},{status:'active'},{new:true})
           }else{
            res.status(400).json({
                status:false,
                message:'failed'
            });
        }
    }catch(err){
         console.log("Error",err);
    }
})

router.post('/present',async(req,res)=>{
    try{
        const result = await teacherSchema.find({empID:req.query.empID}).exec();
        
        if (result){
            let result = await teacherSchema.updateOne({empID:req.query.empID},{status:'active'},{new:true})
           }else{
            res.status(400).json({
                status:false,
                message:'failed'
            });
        }
    }catch(err){
         console.log("Error",err);
    }
})

router.get('/absent',async(req,res)=>{
    try{

        const result = await teacherSchema.find({empID:req.query.empID}).exec();
        
        if (result){
            let result = await teacherSchema.updateOne({empID:req.query.empID},{status:'inactive'},{new:true})


            //res.status(200).json({result:'success'});
            
        
        }else{
            res.status(400).json({
                status:false,
                message:'failed'
            });
        }

       }catch(err){
         console.log("Error",err);
    }
})


router.get('/send-mail', async(req, res) =>{
    const result = await teacherSchema.find().exec();
      if(result)
          res.render('mail-form', { title: 'Send Mail with nodejs' , result});
  });
  
  
  router.post('/send-email', async(req, res)=>{
     try{
      const result = await teacherSchema.find().exec();
      if(result){
          var receiver = req.body.to;
      var subject = req.body.subject;
      var message = req.body.message;
      
      var transporter = nodemailer.createTransport({
          service:"gmail",
          host:"smtp.gmail.com",
          port: 587,
          secure:false,
          auth:{
              user:"divyachinnu.j1988@gmail.com",
              pass:"nhtlbvntzdkzzbde"
          }
      });
            
        
        var mailOptions = {
          from: 'divyachinnu.j1988@gmail.com',
          to: receiver,
          subject: subject,
          text: message
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email was sent successfully: ' + info.response);
          }
        });
        res.render("message",{success:`Success!!! Announcement sent`})
  
      }
  
     }catch(err){
      console.log(err);
     }
  });



router.post("/teacherregister",async (req,res)=>{
    try{
    
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
          res.render("message",{success:`Success!!! ${req.body.firstName} your details are registered`})
          //res.status(200).json({result:result})
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
router.get('/searchTea', async(req,res)=>{
    try{
        let result = await teacherSchema.find().exec();
        res.render("searchTeacher",{result});
        
    }
        catch(err){
            console.log(err);
        }
});
router.post("/all",async(req,res)=>{
    try{
        
        let user = await teacherSchema.find().exec();
        if(user){
            console.log("valid");
            let port = 4000;
            const mailData = {
               to:user.email,
               subject:"Reset Password Link",
               text:"Hello",
               fileName:"resetpwdlink.ejs",
               details:{
                   Name:"Divy",
                   date:new Date(),
                   link:`http://localhost:${port}/resetpwd`,
               },
           };
       
           let mailresult = mailsending(mailData);
           if(!mailresult){
               console.log("mail not sending");
           }else{
               console.log("email sent");
           }    
        }
    }
        catch(err){
               console.log("Error",err);
           }
       });
       


router.get('/editTeacher',async(req,res)=>{
    try{
    console.log(req.query._id);
    const result = await teacherSchema.findOneAndUpdate({empID:req.query.empID},req.body,{new:true});
        
        if (result){
            
            res.render("editTeacher",{result});
            
        
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

router.post('/editTeacher',async(req,res)=>{
    try{
        let empID = req.query.empID;
        const result = await teacherSchema.findOneAndUpdate({empID:empID},req.body);
        
        if (result){
            
            res.render("message",{success:`Success!!!! ${empID} updated successfully`});
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

        
router.get("/deleteTeacher/:firstName",async (req,res)=>{
    
    
    const User = await teacherSchema.findOneAndDelete({firstName:req.params.firstName}).exec();
    
    if(User){
        res.render("message",{success:`Success!!! ${req.params.firstName} deleted successfully`});
    }else{
        res.status(400)
        .json({status:false,
        message:"No user found",
    });
    }
});
router.get('/announcement',async(req,res)=>{
    try{
        let result = await teacherSchema.find().exec();
        res.render("announcement",{result});
        
        
    }
        catch(err){
            console.log(err);
        }
});
module.exports = router;
