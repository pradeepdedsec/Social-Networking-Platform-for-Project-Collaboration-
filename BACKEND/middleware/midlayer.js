const db=require("../dbdata/data");

const table='accounts';




const getDetails =async (req,res,next) =>{

    let username=await req.user;
    let username2=await req.body.username;
    if(!username)
        username=username2;

    db.query(`select * from accounts where username="${username}"`,async(err,results) =>{
        if(err){ 
            console.error(err.message);
            req.user="invalid";
            next();
        }


        if(await results?.length===1){
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
 

        if(await results==="invalid"){ console.log("1");req.exist=false}
        else if(await results.length===1){ console.log("2");req.exist=true}
        else if(await results.length===0 || !results){ console.log("3");req.exist=false}
        next();
}

const addUser=async(req,res)=>{

    const {username,password,name,skill}=await req.user;
    db.query(`insert into ${table} values("${username}","${password}","${name}","${skill}")`,(err,results) =>{
        if(err) throw new Error("Error while adding user");
    });
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

module.exports={
    getDetails,
    isExist,
    getPassword,
    getUserDetailts,
    addUser
}