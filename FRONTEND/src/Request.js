import React, {useState ,useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Title from './Title'
import './Request.css'
import { domain } from "./Hostdata";

const Request = () => {

    const [skills,setskills]=useState("");
    const [description,setdes]=useState("");
    const [msg,setmsg]=useState("");
    const navigate=useNavigate();


    useEffect(() => {
        const fetchData = async () => {
          try {
            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/profile/getprofile",{
            method:"get",
                    headers:{
                        "Authorization":`Bearer ${cookie}`,
                        "Content-Type":"application/json"
                    }
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                navigate("/Login");
            }
          } catch (error) {
                navigate("/Login");
            console.error('Error fetching or parsing data:', error);
          }
        };
    
        fetchData();
    }, []);


    async function handlerequestsubmit(){
        try {
            if(skills==="" || description===""){
                setmsg("Both the skills and description are required fields");
                return;
            }

            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/teamrequest/upload",{
            method:"post",
                    headers:{
                        "Authorization":`Bearer ${cookie}`,
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({"skills":skills,"description":description})
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                navigate("/Login");
            }
            setmsg(await res1.message);
            setskills("");
            setdes("");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
          }
    }
  return (
    <>
    <NavBar />
    <Title />
    <div className='totalrequestbox'>
        <h1 style={{color:"rgb(83, 117, 226)",marginTop:"15px"}}>TEAM MEMBER REQUEST</h1>
        <input id='teamuploadbox' type="text" value={skills} onChange={(e)=>setskills(e.target.value)}  placeholder="Enter skills and separate with comma (e.g., Java, Python, React)"/>
        <textarea id='teamuploadarea' value={description} onChange={(e)=>setdes(e.target.value)} placeholder='Description'></textarea>
        <button id='uploadsubmitbtn' onClick={handlerequestsubmit}>Submit</button>
        <div>
            <p>{msg}</p>
        </div>
    </div>
    
    </>
  )
}

export default Request