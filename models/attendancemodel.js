const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');


const attendanceSchema = new Schema({
    uuid:{type:String,required:false},
    
    attendance:{
        type:String,
        enum:['present','absent'],
        required:false,
        default:'absent'
    },
    stuID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    date:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    }


});

attendanceSchema.pre("save",function(next){
    this.uuid = "ATT-" + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase();
    next();
});


const Attendance = mongoose.model("attendance",attendanceSchema);
module.exports = Attendance;