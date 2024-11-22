const express=require("express");
const mysql=require("mysql");
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

Router.use(express.json());


Router.post("/feed",async(req,res) =>{
    
    const username=await req.user.username;

    if(await username){
        db.query(`insert into feedback (username,feedback) values("${await username}","${await req.body.feedback}")`,async(err,res1)=>{
            if(err) {console.log(err); res.json({message:"Invalid data"})}
            else
                res.json({message:"Your feedback has been Successfully submitted"});
        });
    }
    else if(await req.exist===false) res.json({message:"Invalid credentials"});
});

module.exports=Router