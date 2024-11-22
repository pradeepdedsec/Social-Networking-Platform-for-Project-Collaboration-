import React, { useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import { useNavigate } from 'react-router-dom';
import './AdminSearch.css';
import AdminTitle from './AdminTitle';
import { domain } from "../Hostdata";

const AdminSearch = () => {

  const [searchbar,setsearchbar]=useState("");
  const navigate=useNavigate();
  const[userprofiles,setprofiles]=useState([]);
  const [nores,setnores]=useState("");

  useEffect(() => {
    const fetchData = async () => {
      try{
        const cookie = localStorage.getItem('collab');
        const response=await fetch(domain+"/admin/getallusers",{
          method:"get",
                  headers:{
                      "Authorization":`Bearer ${cookie}`,
                      "Content-Type":"application/json"
                  }
          });
          const res=await response.json();
      
          if(await res.message==="Unauthorized" || await res.message==="Invalid data"){
              navigate("/AdminLogin");
          }
          console.log("success");
          
          if(!(await res)){
            setnores("No results found for the given skills");
            setprofiles([]);
          }
          else if(await res.length>0){
            setprofiles(await res);
            setnores("");
          }
          console.log(userprofiles);
      } 
      catch (error) {
        console.error('Error fetching or parsing data:', error);
        navigate("/AdminLogin");
      }
    };

    fetchData();
  },[]);

  function handleopen(uname){
    console.log("/AdminDisplayProfile/"+uname);
    navigate("/AdminDisplayProfile/"+uname);
  }

  async function searchUser(){

    if(!searchbar || searchbar==="")
      return;

    console.log("username :"+searchbar);
      try{
        const cookie = localStorage.getItem('collab');
        const response=await fetch(domain+"/admin/getuser/"+searchbar,{
          method:"get",
                  headers:{
                      "Authorization":`Bearer ${cookie}`,
                      "Content-Type":"application/json"
                  }
          });
          const res=await response.json();
      
          if(await res.message==="Unauthorized"  || await res.message==="Invalid data"){
              navigate("/AdminLogin");
          }
          console.log("success");
          if(await res.length>0){
            setprofiles(await res);
          }
          else{
            setprofiles([]);
          }
          console.log(userprofiles);
      } 
      catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchUser();
    }
  };

  return (
    <>
    <AdminNavBar />
    <AdminTitle />
    <div className='boxforsearch'>
          <input className='searchinput' onKeyDown={handleKeyPress}  type="text" value={searchbar} onChange={(e)=>setsearchbar(e.target.value)} placeholder='Enter Username' />
          <button className='searchbtn' onClick={searchUser}>Search</button>
    </div>
    <div className='totalprofilebox'>
          

            <div className='aaskillsbox' >
            {
              userprofiles.length>0?(
              userprofiles.map((e,k) => 
                                          <div className='profilebox'>
                                          <div className='dpbox'> 
                                          <center style={{marginRight:"60px"}}><p>{nores}</p></center>
                                          {e.profile_name?(<img id='dp'src={e.profile_name} alt="Error" />)
                                            :(<img id='dp'src={require("./logo.jpg")} alt="Error" />)}
                                          </div>
                                          <div className='detailbox'>
                                            <p>Name  : {e.name}</p>
                                            <p>Location  : {e.city},{e.state},{e.country}</p>
                                            <p>Skills  : {e.skill.replaceAll(",",", ")}</p>
                                            <button className='openbtn' onClick={()=>handleopen(e.username)}>open</button>
                                          </div>
                                          </div>
                                      )):(<br/>)
            }
            </div>
      </div>
    </>)
}

export default AdminSearch