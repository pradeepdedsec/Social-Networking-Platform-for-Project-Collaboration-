import React, {useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import './AdminDisplayMsgs.css';
import AdminTitle from './AdminTitle';
import { domain } from "../Hostdata";

const AdminDisplayMsgs = () => {

    const [userone,setuserone]=useState("");
    const [usertwo,setusertwo]=useState("");
    const [msg,setmsg]=useState("");
    const [chats,setchats]=useState([]);
    const navigate=useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
    
                const cookie = localStorage.getItem('collab');
                const response=await fetch(domain+"/admin/profile/getprofile",{
                method:"get",
                        headers:{
                            "Authorization":`Bearer ${cookie}`,
                            "Content-Type":"application/json"
                        }
                });
                const res=await response.json();
                let res1=await res;
                if(await res1.message==="Unauthorized"){
                    navigate("/AdminLogin");
                }
                console.log("Success");
              } catch (error) {
                  console.error('Error fetching or parsing data:', error);
                  navigate("/AdminLogin");
              }
        };
    
        fetchData();
      }, []);

    async function getchats(){
        
        if(userone==="" || usertwo===""){
            setmsg("Both usernames are required to getchats");
            return;
        }
        else{
            console.log("entered");

            try {
                const cookie = localStorage.getItem('collab');
                const response=await fetch(`${domain}/admin/getchats/${userone}/${usertwo}`,{
                method:"get",
                        headers:{
                            "Authorization":`Bearer ${cookie}`,
                            "Content-Type":"application/json"
                        }
                });
                const res=await response.json();
                let res1=await res;
                if(await res1.message==="Unauthorized"){
                    console.log("unauth");
                    navigate("/AdminLogin");
                }
                setmsg(await res1.message);
                if(await res1.message==="chats successfully retrieved"){
                  if(res1.chats.length === 0)
                    setmsg("No chats found");
                  else
                    setchats(await res1.chats);
                }
                console.log("Success");
            } catch (error) {
                console.error('Error fetching or parsing data:', error); 
                console.log("last");
                //navigate("/AdminLogin");
            }
        }
    }


  return (
    <>
    <AdminNavBar />
    <AdminTitle />
    
    <div className='aouterbox'>
                          {msg?( <div  className='amupfeedbox alertmsgbox'>
                            <p>{msg}</p>
                          </div>):(<br/>)}
                         
                          <div  className='amupfeedbox'>
                            <input value={userone} onChange={(e)=> setuserone(e.target.value)} type="text" placeholder='username one'/>
                            <input value={usertwo} onChange={(e)=> setusertwo(e.target.value)} type="text" placeholder='username two'/>
                            <button onClick={getchats}>Get chats</button>
                          </div>

                          <div className='amheadfeedbox'>
                            <div style={{marginRight:"280px"}} className='amfeed'>Sender</div>
                            <div className='amfeed'>Message</div>
                            <div style={{marginLeft:"280px"}} className='amfeed'>Receiver</div>
                          </div>
      {
      chats.map((e,k) => <div className='amfeedbox'>
                              <div id='sender' className='amuserbox'>{e.sender}</div>
                              <div id='chatmessage' className='amfeed' >{e.chat}</div>
                              <div id='receiver' className='amuserbox'>{e.receiver}</div>
                          </div>)
      }
    </div>
    </>
  )
}

export default AdminDisplayMsgs