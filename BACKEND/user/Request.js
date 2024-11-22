const express=require("express");
const mysql=require("mysql");
const Router=express.Router();

const table='accounts';

const db=require("../dbdata/data");

Router.use(express.json());


Router.post('/upload',async (req, res) => {
  const uploader=await req.user.username;
  let { skills, description } = req.body;

  
  skills = skills.split(",").map(skill => skill.toLowerCase());

  
  const skillsString = JSON.stringify(skills);

  
  const sql = 'INSERT INTO teamrequest (skills, description, uploader) VALUES (?, ?, ?)';
  db.query(sql, [skillsString, description, uploader], (err, result) => {
    if (err){
      console.log(err);
      res.json({"message":'Team member request was failed to upload'});
    }
    else{
      res.json({"message":'Team member request uploaded'});
    }
  });
});


Router.get('/filter', async(req, res) => {                       //changed
    const username="pradeepdedsec";//await req.user.username;

    let skills=[];


    db.query(`select skill from skills where username="${username}"`,async (err,res1) =>{
        try{
            if(err) throw("Error one")
            else if(res1.length>0){
                for(let i=0;i<res1.length;i++){
                    skills.push(res1[i].skill.toString());
                }
                
                skills = skills.map(element => element.toLowerCase());

                const userSkills = ["JavaScript", "React", "Node.js", "HTML", "CSS", "Bootstrap"];
  
                const sql = 'SELECT * FROM teamrequest';
                db.query(sql, (err, results) => {
                  if (err) throw err;
              
                    const requestsWithMatchCount = results.map(request => {
                    const requestSkills = JSON.parse(request.skills);
                    
                    const matchCount = skills.filter(s => requestSkills.includes(s)).length;
                    return { ...request, matchCount };
                  });
            
                  const filteredRequests = requestsWithMatchCount.filter(request => request.matchCount > 0);
              
                  const sortedRequests = filteredRequests.sort((a, b) => b.matchCount - a.matchCount);
              
                  res.json(sortedRequests);
                });
            }
        }
        catch(err){
            console.error(err);
        }
    });
    
    
  });
  




module.exports=Router

