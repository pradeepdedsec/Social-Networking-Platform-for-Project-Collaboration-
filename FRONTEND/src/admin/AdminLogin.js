import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css'
import Cookies from 'js-cookie';
import { domain } from "../Hostdata";

const Login = () => {

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [msg,setMsg]=useState("");
    const navigate=useNavigate();

    async function handlelogin(){
        if(username ==="" || password===""){
            setMsg("Username and password required feilds");
            return;
        }
        const cookie = localStorage.getItem('collab');
        const response=await fetch(domain+"/admin/auth/login",{
            method:"post",
                headers:{
                    "Authorization":`Bearer ${cookie}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({"username":username,"password":password})
        });

        const res1=await response.json();

        console.log(await res1.message);
        if(await res1.message==="Successfully Loggedin"){
            localStorage.setItem("collab",res1.cookie);
            console.log(res1.cookie);
            navigate("/AdminHome");
        }
        else
            setMsg("Invalid Credentials");
    }

    async function handleforgotpass(){
        const cookie = localStorage.getItem('collab');
        const response=await fetch(domain+"/admin/auth/forgotpassword/sendpassword",{
            method:"post",
                headers:{
                    "Authorization":`Bearer ${cookie}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({})
        });

        const res1=await response.json();

        setMsg(res1.message);
    }

  return (
    <div className='totallogbox'>
        <div className='Llogindiv'>
              <button className='Lloginbtn' onClick={()=>navigate("/AdminLogin")}>Admin login</button>
              <button className='Lloginbtn' onClick={()=>navigate("/Login")}>User login</button>
        </div>
        <div className='loginbox'> 
            <div className='log' >
                <div style={{textAlign:"center",fontSize:"40px",fontWeight:"bold",color:"rgb(83, 117, 226)"}}>Admin Login</div>  
                <input className='textbox' type="text"  onChange={e => {setMsg(""); setUsername(e.target.value)}} placeholder='Username'/><br></br>
                <input className='textbox' type="password" onChange={e => {setMsg("");setPassword(e.target.value)}} placeholder='Password'/><br></br>
                <p id='forget' onClick={handleforgotpass}>Forgot password?</p><br></br>
                {
            <div>
                <p style={{textAlign:"center",marginTop:"15px",marginBottom:"0px",fontSize:"12px"}}>{msg}</p>
            </div>}
                <button id='loginbtn' onClick={handlelogin}>Log In</button><br></br>
            </div>
        </div>
    </div>
  )
}

export default Login;