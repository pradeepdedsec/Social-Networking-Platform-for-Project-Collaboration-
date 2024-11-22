import React, { useEffect, useRef, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate, useParams } from 'react-router-dom';
import './Search.css';
import Title from './Title';
import './Message.css';
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import { domain, socketdomain } from "./Hostdata";
import io from 'socket.io-client';
import Cookies from 'js-cookie';
let socket;

const Message = () => {

  let temptest;
  const [searchbar,setsearchbar]=useState("");
  const navigate=useNavigate();
  const[userprofiles,setprofiles]=useState([]);
  const [namelists,setnamelists]=useState([]);
  let totalchats=[];
  let currentuser="";
  const [currentfrnd,setcurrentfrnd]=useState([]);             
  const [currentchats,setcurrentchats]=useState([]);
  var tempchats=[];
  const[refresh,setrefresh]=useState("");
  const [currenttxtboxmsg,setctbmsg]=useState("");
  const {msgto}=useParams();
  let lastmsg=useRef();

  useEffect(()=>{
    window.addEventListener("beforeunload", (event) => {
      // Prevent reload by canceling the event
      event.preventDefault();
    });
  },[]);



  const fetchData = async () => {
    try {

      const cookie = localStorage.getItem('collab');
      const response = await fetch(domain + "/message/getallchat", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${cookie}`,
            "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res1 = await response.json();
      console.log("check :","username" in res1)
      if ("username" in res1 && res1.namelists.length>0) {
          currentuser = res1.username;
          let initialfrnd;
            
            if(msgto && msgto!==currentuser){

              const cookie = localStorage.getItem('collab');
              const url=domain+"/profile/displayprofile/"+msgto;
              const response=await fetch(url,{
              method:"get",
                      headers:{
                        "Authorization":`Bearer ${cookie}`,
                        "Content-Type":"application/json"
                      }
              });
              const res=await response.json();
              
              initialfrnd=[msgto,await res[1][0].profile_name]
            }
            else{
              initialfrnd=[await res1.namelists[0].username,await res1.namelists[0].profile_name];
            }
            if(currentuser===initialfrnd[0]){
                navigate("/Message");
            }
            setcurrentfrnd(initialfrnd);
            await handlecurrentfrndchange(initialfrnd);
            let templists=await res1.namelists;
            let temp2=[];
            for(let i=0;i<templists.length;i++){
              temp2=[...temp2,[templists[i].username,templists[i].profile_name]]
            }
            setnamelists(temp2);
          }

    } catch (error) {
      //navigate("/Login")
      console.error('Error fetching or parsing data:', error);
    }
  };

  useEffect(() => {
     fetchData();
    console.log("connecting...")
    socket=io.connect(socketdomain ,{
      query:{
        userId:localStorage.getItem("collab"),
      }
    }
    );
  
    
  },[]);

  
  useEffect(()=>{
    let tt;
    const temfun=(data)=>{
      console.log("data :", data);
      if(data.sender === currentuser || currentfrnd){
        temptest=data;
        tt=data;
        setcurrentchats( (prechat)=>[...prechat,data]);
      }
    };
    socket.on("receive_message", temfun);
    console.log("tt :",tt);
    if(tt){
      console.log(tt);
    }
    return ()=> {socket.off("receive_message")};
  },[socket])

  async function storechat(){
      if(currenttxtboxmsg==="")
          return;

      const to=currentfrnd[0];
      const msg=currenttxtboxmsg;
      socket.emit("savechat",{"to":to,"message":msg});
      setctbmsg("");
    }

  async function handlecurrentfrndchange(cfrnd){

      try {
            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/message/getchat/"+cfrnd[0],{
                method:"get",
                        headers:{
                        "Authorization":`Bearer ${cookie}`,
                        "Content-Type":"application/json"
                        }
                });
            const res1=await response.json();
            setcurrentchats(JSON.parse(await res1.messages));
            tempchats=JSON.parse(await res1.messages);
            console.log("temp chats :",tempchats);

      } catch (error) {
        //navigate("/Login")
        console.error('Error fetching or parsing data:', error);
      }
  }

  

  function formatDate(timestamp) {
    // Parse the timestamp string into a Date object
    const date = new Date(timestamp);
  
    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Convert hours to 12-hour format and determine AM or PM
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Handle midnight (0) as 12
  
    // Add leading zeros if needed
    hours = hours < 10 ? '0' + hours : hours;
    const formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + amOrPm;
    
    return formattedTime;
  }

  function changecurrentfrnd(cfrnd){
    setcurrentfrnd(cfrnd);
    handlecurrentfrndchange(cfrnd);
  }

  function handlesearchnamelistchange(name){
    setsearchbar(name);
    if(name==="")
      fetchData();

    setnamelists(namelists.filter(e => e[0].toLowerCase().includes(name.toLowerCase())))
  }

  useEffect(() => {
    const element = document.getElementById("currentchatbody");
  element.scrollTop = element.scrollHeight;
  },[currentchats]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      storechat();
    }
  };

  return (
    <>
    <NavBar />
    <Title />
    <div className='totalchatbox'>
      <div className='namelistsbox'>

        <div className='namelistsearchdiv'>
          <input id='namesearch' value={searchbar} onChange={(e)=> handlesearchnamelistchange(e.target.value)} type="text" placeholder='Search' />
          
        </div>
        {
          namelists.map((e)=><div className='namebox' onClick={() =>changecurrentfrnd(e)}>{e[1]?(<img onClick={()=>navigate("/DisplayProfile/"+e[0])} src={e[1]} alt="Error" />):(<img onClick={()=>navigate("/DisplayProfile/"+e[0])} src={require("./logo.jpg")} alt="Error" />)}<p>{e[0]}</p></div>)
        }
      </div>
      
      <div className='currentchatbox'>
        <div className='chatheader'>
        <img onClick={()=>navigate("/DisplayProfile/"+currentfrnd[0])} src={currentfrnd[1] || require("./logo.jpg")} alt="Dps" />
        
          <p className='currentfrndname'>{currentfrnd[0]}</p>
        </div>
        <div id='currentchatbody' className='currentchatbody'>
                  {
                    currentchats.map((e,k)=> 
                    <div className='chatcontainer'>
                      <div className='chatandtime' style={{float:e.receiver===currentfrnd[0]?"right":"left"}}>
                        {k===currentchats.length-1?(<p ref={lastmsg}>{e.chat}</p>):(<p>{e.chat}</p>)}
                        <p className='timestamp'>{formatDate(e.timestamp)}</p>
                      </div>
                    </div>
                  )
                  }
        </div>
        <div className='msgsentbox'>
            <input className='msgforsent' onKeyDown={handleKeyPress}  value={currenttxtboxmsg} onChange={(e) => setctbmsg(e.target.value)} type="text" /><button onClick={storechat} className='msgsendbtn'><IoSend /></button>
        </div>
      </div>
    </div>
    
    </>)
}

export default Message



