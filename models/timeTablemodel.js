const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const timeTableSchema = new Schema({
    subject1 :{type:String},
    subject2 :{type:String},
    subject3 :{type:String},
    subject4 :{type:String},
    subject5 :{type:String},
    subject6 :{type:String},
    subject7 :{type:String},
    subject8 :{type:String},
    subject9 :{type:String},
    standard :{type:String},
    classTeacher :{type:String},
});

const timeTable = mongoose.model("timeTable",timeTableSchema);
module.exports = timeTable;
