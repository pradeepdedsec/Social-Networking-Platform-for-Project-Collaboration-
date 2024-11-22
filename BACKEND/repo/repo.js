const mysql=require("mysql");

const table='accounts';

const db=require("../dbdata/data");

const dbaccount =async (req,res,next) =>{

    const username=await req.user;

    db.query(`select * from accounts where username="${username}"`,async(err,results) =>{
        if(err){ 
            console.error(err);
            throw new Error("Error in db");
        }


        if(results){
            console.log("one");
            req.user= await results;
            next();
        }
        else{
            req.user="invalid";
            next();
        }
    });
}


const isExist=async (req,res,next)=>{

        const results=await req.user;


        if(await results.length===1) req.exist= true;
        else req.exist=false;
        next();
}

const getPassword=async (req,res,next) =>{

    let results;
    
    if(await req.exist===true){
        results=await req.user;
        if(await results.length===1) req.userpass=await results[0].password;
    }
    next();
}

const getUserDetailts=(username) =>{

    const results=dbaccount(username);
    
    if(results.length===0) throw new Error("username dosen't exist");
    else if(results.length===1) return results[0];
};

const addUser=(user)=>{

    const {username,password,name,skill}=user;
    db.query(`insert into ${table} values("${username}","${password}","${name}","${skill}")`,(err,results) =>{
        if(err) throw new Error("Error while adding user");

        return "Success";
    });
}

module.exports={
    dbaccount,
    isExist,
    getPassword,
    getUserDetailts,
    addUser
}