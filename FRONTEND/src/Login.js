import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import Cookies from 'js-cookie';
import { domain } from './Hostdata';

const Login = () => {

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [msg,setMsg]=useState("");
    const navigate=useNavigate();

    async function handlelogin(){
        if(username ==="" || password===""){
            setMsg("Username and password required feilds");
        }
        

        const cookie = localStorage.getItem('collab');
        const response=await fetch(domain+"/auth/login",{
            method:"post",
                headers:{
                    "Authorization":`Bearer ${cookie}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({"username":username,"password":password})
        });

        const res1=await response.json();
        localStorage.setItem("collab",await res1.cookie);
        if(await res1.message === "Successfully Logged in"){
            navigate("/Home");
        }
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
            <div style={{textAlign:"center",fontSize:"40px",fontWeight:"bold",color:"rgb(83, 117, 226)"}}> Login</div>  
            <input className='textbox' type="text"  onChange={e => {setMsg(""); setUsername(e.target.value)}} placeholder='Username'/><br></br>
            <input className='textbox' type="password" onChange={e => {setMsg("");setPassword(e.target.value)}} placeholder='Password'/><br></br>
            <Link id='forget' to="/Forgotpassword">Forgot password?</Link><br></br>
            {
        <div>
            <p style={{textAlign:"center",marginTop:"15px",marginBottom:"0px",fontSize:"12px"}}>{msg}</p>
        </div>}
            <button id='loginbtn' onClick={handlelogin}>Log In</button><br></br>
           
            <p style={{fontSize:"13px",marginTop:"25px"}}>For Registeration <Link to="/Register">Register now</Link></p>
        </div>
    </div>
    </div>
  )
}

export default Login;