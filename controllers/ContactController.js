const ContactModel=require("../models/ContectModel")
const Controllers={}
Controllers.getUser=function(req,res){
    const searchid=req.params.id

    return ContactModel.findById(searchid).then((result)=>res.send(result)).    
    catch((err)=>res.send("err in fetch"))
    
}
/*Controllers.createUser=async function(req,res){
    const data =req.body
    try{
        
    let result=await ContactModel.create({
        fname:data.fname,
        email:data.email,
        phone:data.phone
    })
    res.send(result)
}
catch(err){
    res.send(err)
}
return;
}*/
module.exports=Controllers 