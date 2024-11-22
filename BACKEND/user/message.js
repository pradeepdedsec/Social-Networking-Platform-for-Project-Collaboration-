const express=require("express");
const mysql=require("mysql");
const path=require("path");
const fs=require("fs");
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

Router.use(express.json());

const savechat =async function(username,message,to){
    db.query(`insert into message (sender,receiver,chat) values("${username}","${to}","${message}")`,async(err,res1)=>{
        if(err) {console.log(err); return({"message":"Invalid user 1"})}
        else{
            db.query(`select sender,receiver,chat,timestamp from message where id="${await res1.insertId}"`,async(err,res2)=>{
                if(err) {console.log(err); return({"message":"Invalid user 1"})}
                else{
                    console.log("message :"+JSON.stringify(res2));
                    return({"message":"message has been sent Successfully","chat":res2[0]});
                } 
            });
        } 
    });
}

module.exports=savechat;

Router.post("/savechat",async(req,res) =>{
    const username=await req.user.username;
    const {to,message}=await req.body;

    db.query(`insert into message (sender,receiver,chat) values("${username}","${to}","${message}")`,async(err,res1)=>{
        if(err) {console.log(err); res.json({"message":"Invalid user 1"})}
        else{
            db.query(`select sender,receiver,chat,timestamp from message where id="${await res1.insertId}"`,async(err,res2)=>{
                if(err) {console.log(err); res.json({"message":"Invalid user 1"})}
                else{
                    console.log("message :"+JSON.stringify(res2));
                    res.json({"message":"message has been sent Successfully","chat":res2[0]});
                } 
            });
        } 
    });
});

Router.get("/getchat/:currentfrnd",async(req,res) =>{                //changed
    const currentuser=await req.user.username;
    const frnd=req.params.currentfrnd;
    
    const query=`select sender,receiver,chat,timestamp from message where sender="${await currentuser}" && receiver="${frnd}"`;
    db.query(query,async(err,res1) =>{
        if(err) {console.log(err); console.log(err); res.json({"message":"Invalid user 0"})}
        else {
            db.query(`select sender,receiver,chat,timestamp from message where sender="${frnd}" && receiver="${await currentuser}"`,async (err,res2) =>{
                if(err) {console.log(err); console.log(err); res.json({"message":"Invalid user 0"})}
                else{
                    const concatedarray=await res1.concat(res2);
                    if(concatedarray.length>0){
                        concatedarray.sort((a, b) => {
                            return new Date(a.timestamp) - new Date(b.timestamp);
                        });
                    }
                    res.json({"currentuser":currentuser,"messages":JSON.stringify(concatedarray)});
                }
            });
        }
    })
});

Router.get("/getallchat",async(req,res)=>{           //changed
    const username=await req.user.username;

    let totalchat;
    let namelists;
    let senders;
    let receivers;

    db.query(`select sender,receiver,chat,timestamp from message where sender="${username}" OR receiver="${username}" ORDER BY timestamp`,async(err,res1)=>{
        if(err) {console.log(err); res.json({"message":"Invalid user 2"})}
        else{
            
            totalchat=res1;

            db.query(`select sender,timestamp from message where receiver="${username}" ORDER BY timestamp`,async(err,res2)=>{
                if(err) {console.log(err); res.json({"message":"Invalid user 3"})}
                else{
                    
                    senders=await res2;

                    db.query(`select receiver,timestamp from message where sender="${username}" ORDER BY timestamp`,async(err,res3)=>{
                        if(err) {console.log(err); res.json({"message":"Invalid user"})}
                        else{
                            
                            receivers=await res3;
        
                            totalchat=senders.concat(receivers);
                            
                            totalchat.sort((a, b) => {
                                return new Date(b.timestamp) - new Date(a.timestamp);
                            });

                            const namesMap = new Map();

                            totalchat.forEach(row => {
                            if (row.sender) {
                                namesMap.set(row.sender, null); // Using Map's key to store unique names
                            }
                            if (row.receiver) {
                                namesMap.set(row.receiver, null);
                            }
                            });

                            const uniqueNames = Array.from(namesMap.keys());
                            console.log("namelists :"+uniqueNames);
                            if(!uniqueNames || uniqueNames.length === 0){
                                res.json({"username":await username,"namelists":[]});
                            }
                            else{
                                db.query(`select username,profile_name from accounts where username in (?)`,[uniqueNames],async(err,res3)=>{
                                    if(err) {console.log(err); res.json({"message":"Invalid user"})}
                                    else{
    
                                        const indexDict = {};
                                        uniqueNames.forEach((name, index) => {
                                            indexDict[name] = index;
                                        });
    
                                        // Sort res3 based on the indices of usernames in uniqueNames
                                        const sortedRes3 = await res3.sort((a, b) => indexDict[a.username] - indexDict[b.username]);
    
                                        
    
                                        let imageNames=sortedRes3.map((e)=>e.profile_name);
    
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
                                        for(let i=0;i<sortedRes3.length;i++){
                                            sortedRes3[i].profile_name=await images[i].profile_name;
                                        }
                                        console.log("entered");
                                        res.json({"username":await username,"namelists":await sortedRes3});
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
});

module.exports=Router

/*
const savechat =async function(username,message,to){
    db.query(`insert into message (sender,receiver,chat) values("${username}","${to}","${message}")`,async(err,res1)=>{
        if(err) {console.log(err); return({"message":"Invalid user 1"})}
        else{
            db.query(`select sender,receiver,chat,timestamp from message where id="${await res1.insertId}"`,async(err,res2)=>{
                if(err) {console.log(err); return({"message":"Invalid user 1"})}
                else{
                    console.log("message :"+JSON.stringify(res2));
                    return({"message":"message has been sent Successfully","chat":res2[0]});
                } 
            });
        } 
    });
}

module.exports=savechat;
*/


