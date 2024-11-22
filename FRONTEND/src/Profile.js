import React, {useState ,useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from'./NavBar'
import './profile.css'
import Title from './Title';
import axios from 'axios';
import Postdelete from './Overlay/Postdel';
import LogoutOverlay from './Overlay/LogoutOverlay';
import Cookies from 'js-cookie';
import { domain } from './Hostdata';

const Profile = () => {

    const [username,setusername]=useState("");
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
    const [selectedFile, setSelectedFile] = useState("");
    const fileInputRef = useRef(null);
    const [posts,setposts]=useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [currentdeletepost,setcurdelpos]=useState("");
    const navigate=useNavigate();
    const [logisOpen, setlogIsOpen] = useState(false);

    const {oldFile}=useParams();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };

      const getposts= async (uname)=>{

            const cookie = localStorage.getItem('collab');
            axios.get(`${domain}/posts/get/${uname}`, {
                headers: {
                  'Authorization': `Bearer ${cookie}`,
                  },
            })
            .then(async response => {
              const temposts = response.data;
              console.log("posts:", JSON.stringify(temposts));

              axios.post(domain+'/posts/getposts', { posts: temposts }, {
                headers: {
                  'Authorization': `Bearer ${cookie}`,
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


      const deletepost=async (p_name)=>{
        try {

            const cookie = localStorage.getItem('collab');
            await fetch(`${domain}/posts/delete/${p_name}`,{
              method:"delete",
                      headers:{
                          "Authorization":`Bearer ${cookie}`,
                          "Content-Type":"application/json"
                      }
              });
            fetchData();
            closeOverlay();
            }
        catch (error) {
            console.error('Error while fetching or parsing posts:', error);
        }
      }

      const handleSubmit = async () => {
        if(!selectedFile)
            return;
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
          const cookie = localStorage.getItem('collab');
          const response = await axios.post(`${domain}/posts/upload/${username}`, formData, {
            headers: {
              'Authorization': `Bearer ${cookie}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          setSelectedFile(null);
          if (fileInputRef.current) { 
            fileInputRef.current.value = "";
          }
          const resp=await response.data;
          console.log('Image uploaded:', resp);
          if(resp.message==='Image uploaded successfully.'){
            fetchData();
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };


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

          setusername(await res1.username);
          getposts(await res1.username);
          setprofile_name(await res1.profile_name);
          setname(await res1.name);
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
          if((await res1.education)){
              if(await res1.education.length>0)
                  seteducaion(await res1.education.split(","));
          }
          if((await res1.ideas)){
              if(await res1.ideas.length>0)
                  setideas(await res1.ideas.split(","));
          }   
          console.log("Success");
        } catch (error) {
          console.error('Error fetching or parsing data:', error);
        }
      };

      
    useEffect(() => {
        
        fetchData();
      }, []);
    
    console.log("valid");

    function handlelogout(){
        localStorage.removeItem("collab");
        console.log("entered");
        //window.location.reload();
        navigate("/Login");
    }

    const openOverlay = () => {
        setIsOpen(true);
      };
    
      const closeOverlay = () => {
        setIsOpen(false);
      };

      const closelogOverlay = () => {
        setlogIsOpen(false);
      };

    const delpos = (poname)=>{
        setcurdelpos(poname);
    }

    const handledeletepost=(poname)=>{
        delpos(poname);
        openOverlay();
    }
    

  return (

    <div>
        <NavBar />
        <Title />
        <div id='profilepage'>
            <div id='p1' className='box'>
                <div  id='p11'className='Pinnerbox'>
                    <div id='userdp'>
                            {profile_name?(<img id='dp'src={profile_name} alt="Error" />)
                            :(<img id='dp'src={require("./logo.jpg")} alt="Error" />)}
                    </div>
                    <div id='p111'>
                        <p>Name         : {name}</p>
                        <p>Age          : {age}</p>
                        <p>Gender       : {gender}</p> 
                        <p>Email        : {email} </p>
                        <p>Phone number : {phone_number} </p>
                    </div>
                    <div id='p112'>
                        <p>DOB    :{dob}</p>
                        <p style={{fontWeight:"bold"}}>Location </p>
                        <p>city : {city} </p>
                        <p>state : {state} </p>
                        <p>country : {country}</p>
                    </div>
                </div>
            </div>


            <div id='p2'  className='box'>
                <div id='skills'  className=' skillsbox'>
                    <h2 style={{ position:"relative",height:"20px",left:"10px"}}>SKILLS</h2>
                    <div id='skillslist'>
                        {skill.map((s) => <div className='skill'><p>{s}</p></div> )}
                    </div>
                </div>
            </div>


            <div id='p3'  className='Dabox'>
                <div>
                    <h2>ABOUT</h2>
                    <div id='p33'  className='Daboutbox'>
                        <p className='Dabouttxt'>{about}</p>
                    </div>
                </div>
            </div>


            <div id='p4' className='box'>
                <div id='p44'  className=' projectideas'>
                    <div className='projectideasheader'>
                        <h2>PROJECT IDEAS</h2>
                    </div>
                    <ul id='ideas'>
                        {console.log(education)}
                    {ideas.map((s,k) =><li key={k}>{s}</li>)}
                    </ul>
                </div>
            </div>

            <div id='p5' className='box'>
                <div id='p55'  className='projectideas'>
                <h2>EDUCATION</h2>
                    <ul id='ideas'>
                    {education.map((s,k) =><li key={k}>{s}</li>)}
                    </ul>
                </div>
            </div>
            <div id='p7' className='box'>
                <div id='p77'  className='projectideas'>
                <h2>POSTS</h2>
                <div id='p777'>
                    <input id='choosebtn' ref={fileInputRef}  type="file" onChange={handleFileChange} />
                    <button id='fileuploadbtn'onClick={handleSubmit}>Upload</button>
                </div>
                {
                    posts.length>0?(posts.map((e)=><div className='postdiv'><img src={e.data} alt='Error' />
                    <div className='postbottom'><button onClick={()=>handledeletepost(e.name)}>delete</button></div>
                    </div>)):(<br/>)
                }
                </div>
            </div>
            <div id='p6' className='totallogoutbox'>
                <div id='p66'  className='logoutbox'>
                    <button className='updateprofilebtn1' onClick={()=>navigate("/UpdateProfile")}>Update Profile</button>
                    <button className='logoutbtn1' onClick={()=>setlogIsOpen(true)}>Logout</button>
                </div>
                </div>
            </div>
        <Postdelete posname={currentdeletepost} delpos={deletepost} isOpen={isOpen} onClose={closeOverlay} />
        <LogoutOverlay logout={handlelogout} isOpen={logisOpen} onClose={closelogOverlay} />
    </div>
  )
}

export default Profile