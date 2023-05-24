const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());


app.set("view engine","ejs");
app.use(express.static('./img'));

app.get('/homepage',(req,res)=>{
    res.render('homepage.ejs');
});


app.get('/login',(req,res)=>{
    res.render('login.ejs',{success:''});
});
app.get('/email-verify',(req,res)=>{
    res.render('verifyemail.ejs',{success:''});
});
app.get('/home',(req,res)=>{
    res.render('home.ejs');
});

app.get('/teacher',(req,res)=>{
    res.render('register.ejs');
});

app.get('/studentregistration',(req,res)=>{
    res.render('studentregistration.ejs');
});

app.get('/search',(req,res)=>{
    res.render('search.ejs',{result});
})

app.get('/timetable',(req,res)=>{
    res.render('timetable.ejs',{result});
})

app.get('/forgetpwdlink',(req,res)=>{
    res.render('forgetpwdlink.ejs');
})

app.get('/resetpwd',(req,res)=>{
    res.render('resetpwd.ejs',{success:''});
})

app.get('/searchTeacher',(req,res)=>{
    res.render('searchTeacher.ejs',{result});
})

app.get('/editTeacher',(req,res)=>{
    res.render('editTeacher.ejs',{result});
})

app.get('/ediStudent',(req,res)=>{
    res.render('editStudent.ejs',{result});
})

app.get('/message',(req,res)=>{
    res.render('message.ejs',{success});
})
app.get('/checkStudentTotal',(req,res)=>{
    res.render('checkStudentTotal.ejs');
})
app.get('/announcement',(req,res)=>{
    res.render('announcement.ejs',{result});
})

app.get('/mail-form',(req,res)=>{
    res.render('mail-form.ejs',{title:"",result});
});




const env = require("dotenv").config();
app.use(express.json());


const userroute = require("./routes/userroute");
const teacherroute = require("./routes/teacherroute");
const studentroute = require("./routes/studentroute")

const port = 4000;
const uri = process.env.db_url;
mongoose.connect(
    uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log("DB error",err);
});



app.use("/user",userroute);
app.use("/teacher",teacherroute);
app.use("/student",studentroute);



app.listen(port,() => {
    console.log("App is listening port:4000");
});
