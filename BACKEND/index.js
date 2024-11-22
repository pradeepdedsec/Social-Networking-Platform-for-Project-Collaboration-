const express=require("express");
const dotenv=require('dotenv').config();
const jwt=require("jsonwebtoken");
const os=require("os");
const path=require("path");

const app=express();
const {getDetails,isExist} =require("./middleware/midlayer");
const bodyParser=require("body-parser");
const cookieParser=require('cookie-parser')
const {Server}=require("socket.io");
const http=require("http");
const db = require("./dbdata/data");


app.use(express.static(path.join(__dirname, "../FRONTEND/build")));



const server=http.createServer(app);
 
const io = new Server(server, {
    cors: {
        origin: "https://collab-finder.onrender.com",
		methods: ["GET", "POST"],
    },
  });


let users=new Map();

function getKeyByValue(value){
    for(let[key,val] of users.entries()){
        if(val === value){
            return key;
        }
    }
    return undefined;
}

io.on("connection",async (socket)=>{
    console.log("User Connected :"+socket.id);
    const origin = socket.request.headers.origin;
  
  console.log('Connection established from origin:', origin);
    let userid=socket.handshake.query.userId;
    if(userid){
        let name=jwt.verify(userid,process.env.SECRET_KEY);
        if(name){
            users.set(name.username,socket.id)
            //users[name.username]=socket.id;
            console.log("user :",name.username);
        }
    }
    else{
        console.log("users :");
    }

    socket.on("savechat",async (data)=>{
        let {to,message}=data;
        let sender=getKeyByValue(socket.id);

        function exe(result0){
            console.log("scene :",result0);
            io.to(users.get(to)).emit("receive_message",result0);
            io.to(users.get(sender)).emit("receive_message",result0);
        }
        console.log("sender :",sender);
        if(await sender && await to && await message){
            await savechat(sender,message,to,exe);
        }


        //io.to(socket.id).emit("receive_message","message");
    });

    socket.on("hello",(data)=>{
        console.log("hello");
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected :"+socket.id);
    });
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/auth",getDetails,isExist,require("./authenticate/auth"));
app.use("/home",require("./middleware/tokenverify"),require("./user/user"));
app.use("/profile",require("./middleware/tokenverify"),require("./user/profile"));
app.use("/feedback",require("./middleware/tokenverify"),require("./user/feedback"));
app.use("/message",require("./middleware/tokenverify"),require("./user/message"));
app.use("/test",require("./user/test"));
app.use("/admin/auth",require("./authenticate/adminauth"));
app.use("/teamrequest",require("./middleware/tokenverify"),require("./user/Request"));
app.use("/admin",require("./middleware/adminverify"),require("./admin/admin"));
app.use("/profilepic",require("./middleware/tokenverify"),require("./user/profilepicture"));
app.use("/posts",require("./middleware/tokenverify"),require("./user/posts"));



app.get("/", (req, res) => {
    console.log("/");
	res.sendFile(path.join(__dirname, "../FRONTEND", "build", "index.html"));
});

app.get("*", (req, res) => {
    console.log("*");
	res.sendFile(path.join(__dirname, "../FRONTEND", "build", "index.html"));
});


server.listen(5000,() =>{
    console.log("socket server started at 5000");
});


const savechat =async function(username,message,to,exe){
    db.query(`insert into message (sender,receiver,chat) values("${username}","${to}","${message}")`,async(err,res1)=>{
        if(err) {console.log(err); return({"message":"Invalid user 1"})}
        else{
            db.query(`select sender,receiver,chat,timestamp from message where id="${await res1.insertId}"`,async(err,res2)=>{
                if(err) {console.log(err); return({"message":"Invalid user 1"})}
                else{
                    console.log("message 0:"+JSON.stringify(res2));
                    exe(res2[0]);} 
            });
        } 
    });
}
