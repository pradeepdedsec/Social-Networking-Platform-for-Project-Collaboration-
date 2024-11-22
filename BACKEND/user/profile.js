const express=require("express");
const mysql=require("mysql");
const Router=express.Router();
const fs = require('fs');
const path = require('path');

const table='accounts';

const db=require("../dbdata/data");

Router.use(express.json());


Router.get("/getprofile",async (req,res)=>{           //changed
    const results=await req.user;
    
    if(!results.username){
        res.json({message:"Unauthorized"});
    }
    else if(results){
        let {username,name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas,profile_name}=await results;

        try{
            if(profile_name){
                const imagePath = path.join(__dirname, '../uploads',profile_name);
                const imageData = fs.readFileSync(imagePath).toString('base64');
                const ext = path.extname(profile_name).toLowerCase().slice(1); // Get the extension without the dot
                profile_name= `data:image/${ext};base64,${imageData}`;
            }
        }
        catch(err){
            console.log(err);
        }
        console.log("here 3 :",name);
        res.json({username,name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas,profile_name});    
    }
});


Router.get("/displayprofile/:uname",async (req,res)=>{    //changed
    console.log("here :---------------------------------");
    
    const uname=req.params.uname;
    const username=await req.user.username;

    db.query(`select username,name,profile_name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas
            from accounts where username="${uname}"`,async (err,res1) =>{
                if(err){
                    console.log(err);
                    res.json({message:"Error"});
                }
                else if(res1){

                    try{
                        const imagePath = path.join(__dirname, '../uploads',await res1[0].profile_name);
                        const imageData = fs.readFileSync(imagePath).toString('base64');
                        const ext = path.extname(await res1[0].profile_name).toLowerCase().slice(1);
                        res1[0].profile_name= `data:image/${ext};base64,${imageData}`;
                    }
                    catch(err){
                        console.log(err);
                    }
                    res.send([await username,await res1]);
                }
            })
});

Router.post("/updateProfile",async (req,res)=>{
    
    let {name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas}=await req.body;

    db.query(`update ${table} set 
        name="${name}",
        age="${age}",
        gender="${gender}",
        skill="${skill}",
        dob="${dob}",
        email="${email}",
        phone_number="${phone_number}",
        about="${about}",
        city="${city}",
        state="${state}",
        country="${country}",
        education="${education}",
        ideas="${ideas}"
         where username="${await req.user.username}"`,async(err,results) =>{
            
        if(err){
            console.error(err);
            res.json({message:"Error while updating profile"});
        }
        else
            updateSkills(await req.user.username,skill.split(","));
            res.json({message:"profile has been successfully updated"});
    });
});

Router.get("/getprofiles/:skills",async(req,res)=>{           //changed
    let skills = req.params.skills;
    const {usern}=await req.user.username;
    if(skills==="" || !skills)
        res.send([]);

    if(skills){
        skills=skills.split(",");

        const query = `
        SELECT username
        FROM skills
        WHERE skill IN (${mysql.escape(skills)})
        `;

        db.query(query, function (error, results) {
            if (error) throw error;

            if(results.length>0){
                const usernames = results.map(row => row.username);
                
                const usernameCounts = usernames.reduce((counts, username) => {
                    counts[username] = (counts[username] || 0) + 1;
                    return counts;
                }, {});
                
                // Sort usernames based on occurrence count in descending order
                const sortedUsernames = Object.keys(usernameCounts)
                .sort((a, b) => usernameCounts[b] - usernameCounts[a]);
            
                const query = `
                SELECT username,name,profile_name,age,gender,skill,dob,email,phone_number,about,city,state,country,education,ideas 
                FROM accounts
                WHERE username IN (${sortedUsernames.map(username => mysql.escape(username)).join(',')})
                ORDER BY FIELD(username, ${sortedUsernames.map(username => mysql.escape(username)).join(',')})
                `;

                // Execute the SQL query
                db.query(query,async  function (error, results, fields) {
                if (error) {
                    console.error('Error executing query:', error);
                    return;
                }

                if(results.length>0){
                    let imageNames=results.map((e)=>e.profile_name);

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
                                    for(let i=0;i<results.length;i++){
                                        results[i].profile_name=await images[i].profile_name;
                                    }
                    res.send([await req.user.username,results]);
                }
                else
                    res.send([]);
                });
            }
            else
                res.send([]);
        });
    }
});


const updateSkills=async (name,skills) =>{
    let bskills=[];


    db.query(`select skill from skills where username="${name}"`,async (err,res1) =>{
        try{
            if(err) throw("Error one")
            else{
                for(let i=0;i<res1.length;i++){
                    console.log("skill :"+res1[i].skill);
                    bskills.push(res1[i].skill);
                }

                skills = skills.map(element => element.toLowerCase());
                bskills = bskills.map(element => element.toLowerCase());

                let uskills = skills.filter(skill => !bskills.includes(skill));
                let dbskills = bskills.filter(skill => !skills.includes(skill));

                if(dbskills.length>0){
                    const sql = `DELETE FROM skills WHERE username = ? AND skill IN (?)`;
                    db.query(sql, [name, dbskills], (err, results) => {
                    if (err) {
                        console.log('Error deleting rows:');
                        throw new Error(err);
                    }
                    console.log('Rows deleted:', results.affectedRows);
                    });
                }
                if(uskills.length>0){
                    const values = uskills.map(skill => [name, skill]);
                    const sql = `INSERT INTO skills (username, skill) VALUES ?`;

                    db.query(sql, [values], (err, results) => {
                    if (err) {
                        console.error('Error inserting skills:');
                        throw new Error(err);
                    }
                    console.log('Skills inserted:', results.affectedRows);
                    });
                }
            }
        }
        catch(err){
            console.error(err);
        }
    }); 
};


module.exports=Router


/**
  if(skills.length>0){
        skills=skills.map((skill) =>`("${name}","${skill}")`);
        db.query(`insert into skills (username,skill) values${skills}`,async(err,results) =>{
            if(err){
                console.log(err);
                return;
            }   
        })
    }
    return;



    for(let i=0;i<uskills.length;i++){
            for(let j=0;j<dbskills.length;j++){
                if(uskills[i]===dbskills[j]){
                    uskills=uskills.filter((a) =>!(uskills[i]===a));
                    dbskills=dbskills.filter((a) =>!(uskills[i]===a));
                };
            }
        }



    
    let uskills=skills;
    let dbskills=[];

    console.log("test :"+name);

    db.query(`select skill from skills where username="${name}"`,(err,res1) =>{
        try{
            if(err) throw("Error one")
            else{
                for(let i=0;i<res1.length;i++){
                    console.log("skill :"+res1[i].skill);
                    dbskills.push(res1[i].skill);
                }

                for(let i=0;i<uskills.length;i++){
                    for(let j=0;j<dbskills.length;j++){
                        if(uskills[i]===dbskills[j]){
                            uskills=uskills.filter((a) =>!(uskills[i]===a));
                            dbskills=dbskills.filter((a) =>!(uskills[i]===a));
                        };
                    }
                }

                console.log(uskills);
                console.log(dbskills);

                let values="";
                for(let i=0;i<dbskills.length;i++){
                    values=values+`skill="${dbskills[i]}"`;
                    if(!(i===dbskills.length-1))
                        values=values+" OR ";
                }
                console.log(values);
                let str=`delete from skills where username="${name}" AND ${values}`;
                console.log(str);
                db.query(str,async(err,res2) =>{
                    if(err) throw Error(err);
                });
            }
        }
        catch(err){
            console.error(err);
        }
    }) 



    
 */