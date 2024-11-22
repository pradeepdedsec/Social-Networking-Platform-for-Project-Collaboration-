import React, {useState ,useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import NavBar from'./NavBar'
import './profile.css'
import Login from './Login';
import Title from './Title';
import { domain } from './Hostdata';

const Home = () => {

    const [isverified,setverified]=useState(false);
    const [name,setname]=useState("");
    const navigate=useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/profile/getprofile",{
            method:"get",
                    headers:{
                      'Authorization':`Bearer ${cookie}`,
                      "Content-Type":"application/json"
                    }
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized" || await res1.name === undefined){
                navigate("/Login");
            }
            setname(await res1.name);
            console.log("Success");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
          }
        };
    
        fetchData();
      }, []);
    console.log("valid");

    

  return (

        <div>
          <NavBar />
          <Title />
           <center><h1>Welcome, {name}</h1></center>
           <div className='aouterhomebox'>
              <div className='atotalhomebox'>
                <div className='ahomebox'>
                  <p>Welcome to our collaborative project platform! Designed with students in mind, our platform aims to bridge the 
                    gap between aspiring creators by facilitating seamless team formation for project development. Whether you're a 
                    master of front-end design, a coding whiz, or a creative genius, our platform connects you with like-minded individuals, 
                    making it easier than ever to bring your ideas to life. Say goodbye to solo struggles and hello to collaborative success. 
                    Join us today and unlock the power of teamwork!</p>
                </div>
            </div>
            <div className='aimgboxdiv'>
            <img className='ahomeimg' src={require("./images/home-img.png")} alt="image" />
          </div>
          </div> 
        </div>
  )
}

export default Home;