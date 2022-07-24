const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const UserModel =require("../models/ContectModel")
const jwt = require('jsonwebtoken');
const Controller = require("../controllers/ContactController")
router.get("/:id",Controller.getUser)
//router.post("/create",Controllers.createUser)
router.post("/signup",async(req,res)=>{
    const data=req.body

    const user=await UserModel.findOne({email:data.email})
    if(user){
        res.status(400).send({msg:"email exits already",status:false})
    }
    else{
        try{
            const hashedpassword=await bcrypt.hash(data.password,4)
            const user = new UserModel({
                email:data.email,
                password:hashedpassword,
                role:data.role,
                age:data.age,
                country:data.country,
                pincode:data.pincode
            })
            const result=await user.signUp()
            res.status(200).send({msg:"login successfull",status:true})
        }
        catch(err){
            res.status(404).send({msg:{err},status:false})

        }
    }
})
router.post("/login",async(req,res)=>{
    const data =req.body
    const result=await UserModel.signInStatics(data)
    console.log(result)
    res.send(result)
})
router.post("/updatepassword",authorize,async (req,res)=>{
    const data=req.body
    try{
        const hashedpassword=await bcrypt.hash(data.password,4)
        const updated=await UserModel.findOneAndUpdate({email:req.token.email},{password:hashedpassword})
        console.log(updated)
        if(updated){
            res.status(201).send({msg:"update successfully",status:true})
        }
        else{
            res.status(404).send({msg:"update failed",status:false})
        }
    }
    catch(err){
        console.log(err)
        res.send("updated err")

    }
})
function authorize (req,res,next){
    try{
        let reqheader=req.headers['authorization']
        const token= reqheader.replace("Bearer","")
        console.log(token)
        const verifiedtoken=jwt.verify(token,'jamesbond')
        req.token=verifiedtoken 
        next()
        return
    }
    catch(err){
        console.log(err)
        res.send({msg:"you are not authorized",status:false})
    }
}
module.exports=router