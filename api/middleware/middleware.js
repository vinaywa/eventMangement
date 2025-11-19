const jwt = require("jsonwebtoken");

function isLogin(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
        return res.json({
            success: false,
            message: "please login"
        });
    }

    try {
        let decode = jwt.verify(token, "okkk");
        req.userId = decode.userId;
        next();
    } catch (err) {
        return res.json({
            success: false,
            message: "invalid token"
        });
    }
}

module.exports.isLogin = isLogin;
