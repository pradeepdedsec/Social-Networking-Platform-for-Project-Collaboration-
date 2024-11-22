const express=require("express");
const jwt=require("jsonwebtoken");
const Router=express.Router();
const secretkey=process.env.SECRET_KEY;
const adminusername=process.env.ADMIN_USERNAME;

 
Router.use(express.json());

const adminverify=async (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    let name;
    try{
        if(!token)
            res.json({message:"Unauthorized"});
        else{
            name=jwt.verify(token,secretkey);
            if(name.username===adminusername){
                next();
            }
            else{
                res.json({message:"Unauthorized"});
            }
        }
    }
    catch(err){
        console.log(err);
        res.json({message:"Unauthorized"});
    }
}

module.exports=adminverify