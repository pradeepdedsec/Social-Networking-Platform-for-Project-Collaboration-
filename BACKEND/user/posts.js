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
    cb(null, './BACKEND/posts/');
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

        const imagePath = path.join(__dirname, 'posts', req.file.filename);

        db.query(`insert into posts (post_name,username) values("${req.file.filename}","${username}")`,async (err,res1)=>{
          if (err){
            console.log(err);
            res.status(500).json({"message":'Error uploading image.'});
          }
          else{
            res.status(201).json({"message":'Image uploaded successfully.'});
          }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({"message":'Error uploading image.'});
    }
});

Router.get('/get/:username', async(req, res) => {

  const username=req.params.username;

  db.query(`select post_name from posts where username="${username}"`,async(err,res1)=>{
    if (err){
      console.log(err);
      res.status(500).json({"message":'Error uploading image.'});
    }
    else{
        res.json({"posts":await res1});
    }
  });
});

 


Router.delete('/delete/:name',async(req,res)=>{                           //changed
    const post_name =req.params.name;
  console.log("delete :"+post_name);
  const filePath = path.join(__dirname, "../posts", post_name);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err.message}`);
        } else {
            console.log(`File ${post_name} deleted successfully.`);
        }
    });
    
    db.query(`delete from posts where post_name="${post_name}"`,async(err,res1)=>{
        if (err){
          console.log(err);
          res.status(500).json({"message":'Error while deleting image.'});
        }
        else{
          console.log("successfully deleted");
            res.json({"message":"successfully deleted"});
        }
      });
});

Router.get('/getpost/:postname', async(req, res) => {

  const postname=req.params.postname;
  console.log(postname);
  const imgpath=path.join(__dirname,'../posts',postname);

    fs.readFile(imgpath, (err, data) => {
        if (err) {
            return res.status(404).send('Image not found');
        }

        const ext = path.extname(postname).toLowerCase();
        let contentType = 'image/jpeg'; // Default content type

        if (ext === '.png') {
            contentType = 'image/png';
        } else if (ext === '.gif') {
            contentType = 'image/gif';
        } else if (ext === '.bmp') {
            contentType = 'image/bmp';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});



Router.post('/getposts', async (req, res) => {

  const imageNames = await req.body.posts.posts.map((e)=>e.post_name);
  console.log("posts :"+JSON.stringify(imageNames));

    const imagesDir = path.join(__dirname, '../posts');
    const images = imageNames.map(imageName => {
        const imagePath = path.join(imagesDir, imageName);
        const imageData = fs.readFileSync(imagePath).toString('base64');
        const ext = path.extname(imageName).toLowerCase().slice(1);
        return { name: imageName, data: `data:image/${ext};base64,${imageData}` };
    });
    console.log("entered");
    res.json(images);
});


module.exports=Router

