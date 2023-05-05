const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const shoping_registrationSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:String,
    confirmpassword:String,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

shoping_registrationSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id:this._id.toString()},"mynameisyashiambcastudentfromsdj");
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
}


shoping_registrationSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
});

const Registration = new mongoose.model("Registration",shoping_registrationSchema);

module.exports = Registration;