const express=require("express");
const jwt=require("jsonwebtoken");
const Router=express.Router();
const db=require("../dbdata/data");
const cookieParser = require("cookie-parser");
const cors=require('cors');
const secretkey=process.env.SECRET_KEY;

const table='accounts';

Router.use(express.json());
Router.use(cookieParser());

Router.use(cors({
    origin: ['https://deploy-test-react-snh6.onrender.com', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}));

const tokenlayer=async (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    let name;
    try{
        if(token){
            name=jwt.verify(token,secretkey);
        }
        else{
            console.log("cookie :",token);
        }
        if(!name || !await name.username){
            console.log("cookie 2 :",token);
            res.json({message:"Unauthorized"});
        }
        else{
            db.query(`select * from accounts where username="${await name.username}"`,async(err,results) =>{  
                if(err){ 
                    throw new Error("Error in db");
                }

                if(results.length===0){
                    res.json({message:"Unauthorized"});
                }
                else if(results.length===1){
                    req.user=await results[0];
                    next();
                }    
            });
        }
    }
    catch(err){
        console.log(err);
        res.json({message:"Unauthorized"});
    }
}

module.exports=tokenlayer