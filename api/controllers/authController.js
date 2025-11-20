const USER = require("../models/User");
const jwt = require("jsonwebtoken");
module.exports.postLoginCheck = async(req,res)=>{
    let {email,password} = req.body;
    let userExist = await USER.findOne({email:email});
    if(!userExist){
        return res.json({
            success:false,
            message:"please signup"
        })
    }
    if(userExist.password!=password){
        return res.json({
            success:false,
            message:"invalid user...",
        })
    }
    let token = jwt.sign({"userId":userExist._id},"okkk") //(user,secret key);
    return res.json({
        success:true,
        message:"login in successfully",
        token:token
    })
}
