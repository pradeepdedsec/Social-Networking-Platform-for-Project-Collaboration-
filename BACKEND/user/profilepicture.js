const express=require("express");
const multer = require('multer');
const fs = require('fs');
const mysql=require('mysql');
const path = require('path');
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './BACKEND/uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

Router.post('/upload/:username', upload.single('image'),async (req, res) => {
    const username=req.params.username;
    try {
        if (!req.file) {
        return  res.status(400).json({"message":'Error uploading image.'}); 
        }

        db.query("SELECT profile_name FROM accounts WHERE username = ?", [username], (err, res0) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error while retrieving profile." });
          }

          let isExist=false;
      
          if (res0.length > 0 && res0[0].profile_name) {
            const filePath = path.join(__dirname, "../uploads", res0[0].profile_name);
       
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file: ${err.message}`); 
              } else {
                console.log(`File ${res0[0].profile_name} deleted successfully.`);
              }
            });
          }

          db.query(`update accounts set profile_name="${req.file.filename}" where username="${username}"`,async (err,res1)=>{
            if (err){
              console.log(err);
              res.status(500).json({"message":'Error uploading image.'});
            }
            else{
              res.status(201).json({"message":'Image uploaded successfully.'});
            }
          });


        });

 
        
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({"message":'Error uploading image.'});
    }
});





module.exports=Router

