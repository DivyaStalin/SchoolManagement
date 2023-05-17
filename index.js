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
    res.render('search.ejs');
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
