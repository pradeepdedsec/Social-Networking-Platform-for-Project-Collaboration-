import React, { useState } from 'react'
import './Forgotpwd.css';
import { domain } from "./Hostdata";

const Forgotpass = () => {

    const [username,setUsername]=useState("");
    const [otp,setOtp]=useState("");
    const [confrimPassword,setConfrimPassword]=useState("");
    const [password,setPassword]=useState("");
    const [msg,setMsg]=useState("");

    async function handlesubmit(){
        if(username==="" || otp==="" || password==="" || confrimPassword===""){
            setMsg("Every feild is Required");
        }
        else if(password!==confrimPassword){
            setMsg("passwords and confirm pass doesn't matching");
        }
        else{

            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/auth/forgotpassword/verifyotp",{
                method:"post",
                headers:{
                    'Authorization':`Bearer ${cookie}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({"username":username,"otp":otp,"password":password})
            });
            const res1=await response.json();

            setMsg(res1.message);
            console.log("entered")
        }
    }

    async function sendOtp(){
        if(username===""){
            setMsg("username is required for sending Otp Required");
        }
        else{
            console.log(`${username}`);
            
            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/auth/forgotpassword/sendotp",{
                method:"post",
                headers:{
                    'Authorization':`Bearer ${cookie}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({"username":username})
            });
            const res1=await response.json();

            setMsg(res1.message);
        }
    }

  return (
    <div id='totalforgetbox'>

    <div className='forgetbox'>
        

        <div className='forget'>
            <h2 style={{margin:"0px",fontSize:"29px",color:"rgb(83, 117, 226)"}}>Forget Password</h2>
            <input className='otpbox' type="text"  onChange={e => {setMsg(""); setUsername(e.target.value)}} placeholder='Username'/> <br></br>

            <button id='btn' onClick={sendOtp}>Send Otp</button>  <br></br>
           

            <input className='otpbox' type="text"  onChange={e => {setMsg("");setOtp(e.target.value)}} placeholder='OTP'/>

            <input className='otpbox' type="password" onChange={e => {setMsg("");setPassword(e.target.value)}} placeholder='New password'/>

            <input className='otpbox' type="password" onChange={e => {setMsg("");setConfrimPassword(e.target.value)}} placeholder='Confrim password'/> <br></br>
            {msg.length>0?<div >        
            <p style={{textAlign:"center",marginTop:"15px",marginBottom:"0px",fontSize:"13px"}}>{msg}</p>
            </div>:<></>} 

            <button id='btn' onClick={handlesubmit}>Submit</button>
        </div>
    </div>

    </div>
  )
}

export default Forgotpass