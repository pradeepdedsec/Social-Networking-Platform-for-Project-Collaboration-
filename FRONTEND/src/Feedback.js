import React, {useState ,useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import './Feedback.css'
import Title from './Title';
import { domain } from "./Hostdata";

const Feedback = () => {


    const [feed,setfeed]=useState("");
    const [username,setusername]=useState("");
    const [msg,setmsg]=useState("");
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
            if(await res1.message==="Unauthorized"){
                navigate("/Login");
            }
            if(await res1.username){
                console.log("here");
                setusername(await res1.username);
            }
            else{
                navigate("/Login");
            }
            console.log("Success");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
          }
        };
    
        fetchData();
    }, []);


    async function handlefeedsubmit(){
      try{
        if(feed===""){
          console.log("empty");
          return;
        }
        
        const cookie = localStorage.getItem('collab');
        const response=await fetch(domain+"/feedback/feed",{
          method:"post",
                  headers:{
                    'Authorization':`Bearer ${cookie}`,
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({"feedback":feed})
          });
          const res2=await response.json();
          if(res2.message==="Your feedback has been Successfully submitted"){
              setmsg(await res2.message);
              setfeed("");
          }
          else if(res2.message==="Invalid credentials" || res2.message==="Unauthorized")
              navigate("/Login");
      }
      catch(err){
        console.log(err);
        navigate("/Login");
      }
        
    }

  return (
    <>
    <NavBar />
    <Title />
    <div className='outerfeedbackbox'>
        <div className='totalfeedbox'>
            <div className='feedbox'>
                <h1 style={{color:"rgb(83, 117, 226)",marginBottom:"15px"}}>Feedback</h1>
                <textarea className='feedbackbox' value={feed} onChange={(e) => setfeed(e.target.value)} placeholder='Let us to enhance the user experince by providing your feedback'></textarea>
                <button className='feedsubmitbtn' onClick={handlefeedsubmit}>Submit</button>
                <div>
                  <p>{msg}</p>
                </div>
            </div>
        </div>
        <div className='imgboxdiv'>
          <img className='feedbackimg' src={require("./images/bird.png")} alt="image" />
        </div>
     </div>
    </>
  )
}

export default Feedback