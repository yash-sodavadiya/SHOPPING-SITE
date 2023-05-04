const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const shoping_registrationSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:String,
    confirmpassword:String
});

shoping_registrationSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
});

const Registration = new mongoose.model("Registration",shoping_registrationSchema);

module.exports = Registration;