const router = require("express").Router();
const InternPost = require("../models/internship")



//post
router.post("/add",async (req,res)=>{


try{
    const newInternPost = new InternPost({
        username:req.body.username,
        title:req.body.title,
        img:req.body.img,
        desc:req.body.desc        
    })
    const newPost = await newInternPost.save();
   return res.status(200).json(newPost);

}catch(err){
    res.status(500).json(err)

}

})

module.exports = router;