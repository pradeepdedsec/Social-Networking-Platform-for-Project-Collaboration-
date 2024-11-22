const express=require("express");
const path=require("path");
const fs=require("fs");
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

Router.use(express.json());
const username=process.env.ADMIN_USERNAME;


Router.get("/profile/getprofile",async (req,res) =>{            //changed
    res.json({name:"pradeep",message:"success"});
})


Router.get("/feedback",async(req,res) =>{                      //changed
    

    if(username){
        db.query(`select username,feedback from feedback`,async(err,res1)=>{
            if(err) {console.log(err); res.json({message:"Invalid data"})}
            else
                res.json(res1);
        });
    }
    else if(await req.exist===false) res.json({message:"Invalid credentials"});
});

Router.get("/getallusers",async (req,res) =>{                      //changed
    db.query("select username,profile_name,name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas from accounts",async (err,res1)=>{
        if(err) {console.log(err); res.json({message:"Invalid data"})}
        else{
            let imageNames=res1.map((e)=>e.profile_name);

                                    const imagesDir = path.join(__dirname, '../uploads');
                                    const images = imageNames.map( imageName => {
                                        if(imageName){
                                            let temp=imageName;
                                            const imagePath = path.join(imagesDir, temp);
                                            const imageData = fs.readFileSync(imagePath).toString('base64');
                                            const ext = path.extname(imageName).toLowerCase().slice(1); // Get the extension without the dot
                                            return {"profile_name": `data:image/${ext};base64,${imageData}` };
                                            }
                                        else{
                                            return {"profile_name":null};
                                        }

                                    });
                                    for(let i=0;i<res1.length;i++){
                                        res1[i].profile_name=await images[i].profile_name;
                                    }
            res.json(res1);
        }
                
    });
});

Router.get("/getuser/:username",async (req,res) =>{                       //changed
    const username= req.params.username;
    db.query(`select username,name,profile_name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas from accounts where username="${username}"`,async (err,res1)=>{
        if(err) {console.log(err); res.json({message:"Invalid data"})}
        else{

            let imageNames=res1.map((e)=>e.profile_name);

                                    const imagesDir = path.join(__dirname, '../uploads');
                                    const images = imageNames.map( imageName => {
                                        if(imageName){
                                            let temp=imageName;
                                            const imagePath = path.join(imagesDir, temp);
                                            const imageData = fs.readFileSync(imagePath).toString('base64');
                                            const ext = path.extname(imageName).toLowerCase().slice(1); // Get the extension without the dot
                                            return {"profile_name": `data:image/${ext};base64,${imageData}` };
                                            }
                                        else{
                                            return {"profile_name":null};
                                        }

                                    });
                                    for(let i=0;i<res1.length;i++){
                                        res1[i].profile_name=await images[i].profile_name;
                                    }
            res.json(res1);
        }
                
    });
});


Router.get("/profile/displayprofile/:uname",async (req,res)=>{           //changed
    console.log("here :---------------------------------")
    const uname=req.params.uname;
    

    db.query(`select username,name,profile_name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas
            from accounts where username="${uname}"`,async (err,res1) =>{
                if(err){
                    console.log(err);
                    res.json({message:"Error"});
                }
                else{

                    try{
                        const imagePath = path.join(__dirname, '../uploads',await res1[0].profile_name);
                        const imageData = fs.readFileSync(imagePath).toString('base64');
                        const ext = path.extname(await res1[0].profile_name).toLowerCase().slice(1);
                        res1[0].profile_name= `data:image/${ext};base64,${imageData}`;
                    }
                    catch(err){
                        console.log(err);
                    }

                    res.send([username,await res1]);
                }
            })
    
});

Router.delete("/deleteuser",async(req,res)=>{                           //changed
    const username=await req.body.username;

    db.query(`delete from accounts where username="${username}"`,async(err,res1)=>{
        if(err){
            console.log(err);
            res.json({message:"Error"});
        }
        else{
            console.log(" Account has been deleted Successfully");
            res.json({message:username+" Account has been deleted Successfully"});
        }
    })
});

Router.get("/getchats/:userone/:usertwo",async(req,res)=>{                           //changed
    const userone= req.params.userone;
    const usertwo= req.params.usertwo;
    console.log("usernames :"+userone+" "+usertwo);
    
    db.query(`select * from accounts where username="${userone}" || username="${usertwo}"`,async(err,res0)=>{
        if(err) {console.log(err); console.log(err); res.json({"message":"Error while fetching messages"})}
        else{
            console.log("1");
            if(await res0.length<2){
                if(await res0.length===0){
                    console.log("2"); 
                    res.json({"message":"Both usernames doesn't exist"});
                }
                   
                else if(await res0.length===1){
                    console.log("3");
                    if(await res0[0].username!==await userone)
                        res.json({"message":await userone+" username doesn't exist"});
                    else if(await res0[0].username!==await usertwo)   
                        res.json({"message":await usertwo+" username doesn't exist"});
                }
            }
            else if(await res0.length===2){
                console.log("4");
                db.query(`select sender,receiver,chat,timestamp from message where sender="${await userone}" && receiver="${await usertwo}"`,async(err,res1) =>{
                    if(err) {console.log(err); console.log(err); res.json({"message":"Invalid user 0"})}
                    else {
                        db.query(`select sender,receiver,chat,timestamp from message where sender="${await usertwo}" && receiver="${await userone}"`,async (err,res2) =>{
                            if(err) {console.log(err); console.log(err); res.json({"message":"Invalid user 0"})}
                            else{
                                const concatedarray=await res1.concat(res2);
                                if(concatedarray.length>0){
                                    concatedarray.sort((a, b) => {
                                        return new Date(a.timestamp) - new Date(b.timestamp);
                                    });
                                }
                                res.json({"message":"chats successfully retrieved","chats":concatedarray});
                            }
                        });
                    }
                });
            }
        }
    });
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