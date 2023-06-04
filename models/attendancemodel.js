const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const attendanceSchema = new Schema({
    
         date: {type:String},
         month:{type:String},
         status:{type:String,enum:['present','absent'],default:'absent'},
        student: {
           stuID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "student"
           },
          stuName: String,
          standard:String
        },
    });


const Attendance = mongoose.model("attendance",attendanceSchema);

module.exports = Attendance;