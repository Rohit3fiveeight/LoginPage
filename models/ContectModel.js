const mongoose = require("mongoose")
const Schema =mongoose.Schema
const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt")
/*const ContactSchema= new Schema({
    fname:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    }
})*/
const UserSchema=new Schema({
    email:{
        type:String,
        required:[true,"email is empty please enter email"],
        unique:true/*,
        validate:{
            validator:function(exp){
                return /\[a-zA-Z0-9]*@[a-zA-Z]+.[a-zA-Z]{2,3}/.test(exp)
            },
            message:"this is email is not valid"
        }*/
    },
    password:{
        type:String,
        required:true
    },
    role:{
      type:String,
      enum:{
        values:["admin","trainer","trainee"],
        message:`{VALUE} is not supported`
      }
    },
    country:{
        type:String,
        minlength:[5,"country length should be greater than 3 chars"],
        maxlength:[10,"country length should be less than 10 chars"],
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    address:{
        type:String
    },
    age:{
        type:Number,
        min:[18,"min age should be 18"],
        max:[50,'max age can be 50']
    },

})
UserSchema.methods.signUp=async function(){
    if(!this.address){
        this.address=this.country+"  "+this.pincode
    }
    await this.save()
}
UserSchema.statics.signInStatics=async function(data){
    const user=await UserModel.findOne({email:data.email})
    if(user){
        const comparison=await bcrypt.compare(data.password,user.password)
        console.log(comparison)
        if(comparison){
            const generatedtoken=jwt.sign({email:data.email},'jamesbond',{expiresIn:'1h',algorithm:'HS512',issuer:'olympus.gl.in'})
            console.log(generatedtoken)
            return{msg:"login successfull",status:true,token:generatedtoken,statusCode:200}
        }
        else{
            return{msg:"Please check your password",status:false,statusCode:404}
        }
    }
    else{
        return{msg:"Please check you email",status:false,statusCode:400}
    }
}

const UserModel=mongoose.model("UserModel",UserSchema)
module.exports=UserModel