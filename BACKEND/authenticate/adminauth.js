const express=require("express");
const jwt=require("jsonwebtoken");
const Router=express.Router();
const nodemailer=require("nodemailer");
const bodyParser=require("body-parser");

const mailprefix=" Dear Admin ,\n";
const mailsuffix="username :Admin-pradeep   \n password :earn money  is your credentials";


const adminusername=process.env.ADMIN_USERNAME;
const adminpassword=process.env.ADMIN_PASSWORD;
const secretkey=process.env.SECRET_KEY;

Router.use(express.json());

Router.use(bodyParser.json());


Router.post("/login",async (req,res) =>{

        const{username,password}=await req.body;
        
        if(username===adminusername && password===adminpassword){
                const cookie=jwt.sign({"username":username},secretkey,{expiresIn:"100h"});
                res.json({message:"Successfully Loggedin","cookie":cookie});  
        }
        else{
            res.json({message:"Invalid Credentials"});
        } 
});

Router.post("/forgotpassword/sendpassword",async(req,res) =>{

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                  user: process.env.SERVER_EMAIL,
                  pass: process.env.SERVER_PASSWORD,
              },
              });
              const mailOptions = {
                from: process.env.SERVER_EMAIL,
                to:  process.env.ADMIN_EMAIL,
                subject: "COLLAB FINDER",
                text: "Hello world ", 
                html:
                  "content"
              };


              try{  
                    mailOptions.text=mailprefix+mailsuffix;
                    mailOptions.html=mailprefix+mailsuffix;
                    transporter.sendMail(mailOptions);
                    res.json({message:"Your Credentials has been sent to your email"});
                }
            catch(err){
                console.log(err);   
                res.json({"message":"Error while sending mail"});
            }
});


module.exports=Router












