const jwt = require("jsonwebtoken")
const {createError}= require("../utils/error")

// Verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
  
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT);
  
      // Set the last activity timestamp to the current time
      req.lastActivityTimestamp = Date.now();
  
      // Pass the decoded token to the next middleware or route handler
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Error:", error);
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };

const verifyUser =(req,res,next)=>{
    verifyToken(req,res,next,()=>{
        if(req.user.id===req.params.id|| req.user.isAdmin){
            next()
        }else{
            if(err) return next(createError(403,"You are not authenticated"))
        }
    })
}
const verifyAdmin =(req,res,next)=>{
    verifyToken(req,res,next,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            if(err) return next(createError(403,"You are not authenticated"))
        }
    })
}
module.exports ={verifyToken, verifyUser,verifyAdmin}