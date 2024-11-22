const express=require("express");
const mysql=require("mysql");
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

Router.use(express.json());


Router.get("/server/home",async (req,res)=>{
    res.json({message:"hello, "+await req.user.name}); 
});  
 




module.exports=Router