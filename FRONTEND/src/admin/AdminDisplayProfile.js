import React, {useState ,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminNavBar from'./AdminNavBar'
import './Adminprofile.css'
import AdminTitle from './AdminTitle';
import DeleteUser from '../Overlay/DeleteUser';
import axios from 'axios';
import { domain } from '../Hostdata';

const AdminDisplayProfile = () => {

    const [username,setUsername]=useState("");
    const [name,setname]=useState("");
    const [age,setage]=useState();
    const [gender,setgender]=useState("");
    const [dob,setdob]=useState("");
    const [skill,setskill]=useState([]);
    const [email,setemail]=useState("");
    const [phone_number,setphone_number]=useState("");
    const [about,setabout]=useState("");
    const [city,setcity]=useState("");
    const [state,setstate]=useState("");
    const [country,setcountry]=useState("");
    const [education,seteducaion]=useState([]);
    const [ideas,setideas]=useState([]);
    const [profile_name,setprofile_name]=useState('');
    const [posts,setposts]=useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate=useNavigate();
    let {uname}=useParams();


    const getposts= async (uname)=>{

        const cookie = localStorage.getItem('collab');
        axios.get(`${domain}/admin/get/${uname}`, {
            headers: {
              "Authorization": `Bearer ${cookie}`,
              },
        })
        .then(async response => {
          const temposts = response.data;
          console.log("posts:", JSON.stringify(temposts));


        axios.post(domain+'/admin/getposts', { posts: temposts }, {
            headers: {
              "Authorization": `Bearer ${cookie}`,
              },
        })
        .then(response => {
                  setposts(response.data);
              })
              .catch(error => {
                  console.error('Error posting posts:', error);
              });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const cookie = localStorage.getItem('collab');
            const url=domain+"/admin/profile/displayprofile/"+uname;
            const response=await fetch(url,{
            method:"get",
                    headers:{
                        "Authorization":`Bearer ${cookie}`,
                        "Content-Type":"application/json"
                    }
            });
            const res=await response.json();
            let res1=await res[1][0];
            console.log("two     :"+await res1.name);
            console.log(await res1);
            if(await res1.message==="Unauthorized"){
                navigate("/Login");
            }
            
            setUsername(await res1.username);
            setname(await res1.name);
            setprofile_name(await res1.profile_name);
            getposts(await res1.username);
            setage(await res1.age);
            setgender(await res1.gender);
            setdob((await res1.dob)?await res1.dob:"");
            setemail(await res1.email);
            setphone_number(await res1.phone_number);
            setabout(await res1.about);
            setcity(await res1.city);
            setstate(await res1.state);
            setcountry(await res1.country);
            
            if((await res1.skill)){
                if(await res1.skill.length>0)
                    setskill(await res1.skill.split(","));
            }
            else{
                setskill([]);
            }
            if((await res1.education)){
                if(await res1.education.length>0)
                    seteducaion(await res1.education.split(","));
            }
            else{
                seteducaion([]);
            }
            if((await res1.ideas)){
                if(await res1.ideas.length>0)
                    setideas(await res1.ideas.split(","));
            }
            else{
                setideas([]);
            }   
            
            console.log("Success");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
          }
        };
    
        fetchData();
      }, []);
    console.log("valid");


    async function deleteuser(){
        console.log(username);
        try {
            const cookie = localStorage.getItem('collab');
            const response=await fetch(domain+"/admin/deleteuser",{
            method:"delete",
                    headers:{
                        "Authorization":`Bearer ${cookie}`,
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({"username":username})
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                console.log("unauth");
                navigate("/AdminLogin");
            }
            else{
                navigate("/AdminSearch");
            }
            console.log("Success");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
            console.log("last");
            navigate("/AdminSearch");
          }

    }

    const openOverlay = () => {
        setIsOpen(true);
    };
    
    const closeOverlay = () => {
        setIsOpen(false);
    };
    

  return (
        <div>
            <AdminNavBar />
            <AdminTitle />
            <div id='profilepage'>
                <div id='p1' className='box'>
                    <div  id='p11'className='innerbox'>
                        <div id='userdp'>
                            {profile_name?(<img id='dp'src={profile_name} alt="Error" />)
                            :(<img id='dp'src={require("./logo.jpg")} alt="Error" />)}
                        </div>
                        <div id='p111'>
                            <p>Username     : {username}</p>
                            <p>Name         : {name} </p>
                            <p>Age          : {age}</p>
                            <p>Gender       : {gender}</p> 
                            <p>Email        : {email} </p>
                            <p>Phone number : {phone_number} </p>
                        </div>
                        <div id='p112'>
                            <p>DOB    : {dob}</p>
                            <p style={{fontWeight:"bold"}}>Location </p>
                            <p>city : {city} </p>
                            <p>state : {state} </p>
                            <p>country : {country}</p>
                        </div>
                    </div>
                </div>
    
    
                <div id='p2'  className='box'>
                    <div id='skills'  className=' skillsbox'>
                        <h2 style={{height:"20px"}}>SKILLS</h2>
                        <div id='skillslist'>
                            {skill.map((s) => <div className='skill'><p>{s}</p></div> )}
                        </div>
                    </div>
                </div>
    
    
                <div id='p3'  className='abox'>
                    <div id='p33'  className='aboutbox'>
                    <h2>ABOUT</h2>
                    <p className='abouttxt'>{about}</p>
                    </div>
                </div>
    
    
                <div id='p4' className='box'>
                    <div id='p44'  className=' projectideas'>
                        <h2>PROJECT IDEAS</h2>
                        <ul id='ideas'>
                            {console.log("ideas :"+education)}
                        {ideas.map((s,k) =><li key={k}>{s}</li>)}
                        </ul>
                    </div>
                </div>
    
                <div id='p5' className='box'>
                    <div id='p55'  className='projectideas'>
                    <h2>EDUCATION</h2>
                        <ul id='ideas'>
                            {console.log("eduaction :"+education)}
                        {education.map((s,k) =><li key={k}>{s}</li>)}
                        </ul>
                    </div>
                </div>

                <div id='p7' className='box'>
                    <div id='p77'  className='projectideas'>
                        <h2>POSTS</h2>
                        {
                            posts.length>0?(posts.map((e)=><div className='Dpostdiv'><img src={e.data} alt="Error" />
                            </div>)):(<br/>)
                        }
                    </div>
                </div>

                <div id='p6' className='totallogoutbox'>
                <div id='p66'  className='logoutbox'>
                    <button className='logoutbtn1' onClick={openOverlay}>Delete User</button>
                </div>
            </div>
        </div>
        <DeleteUser deluser={deleteuser} isOpen={isOpen} onClose={closeOverlay} />      
     </div>
  )
}

export default AdminDisplayProfile