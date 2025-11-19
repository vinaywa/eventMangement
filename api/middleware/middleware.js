const jwt = require("jsonwebtoken");

function isLogin(req,res,next){
    let token = req.headers.authorization;
    if(!token){
        return res.json({
            success:false,
            message:"please login"
        })
    }
    let decode = jwt.verify(token,"okkk")
    // console.log(decode);
    if(decode){
        req.userId = decode.userId;
        return next();
    }
    else{
        return res.json({
            success:false,
            message:"invalid token"
        })
    }
    
}
module.exports.isLogin = isLogin;