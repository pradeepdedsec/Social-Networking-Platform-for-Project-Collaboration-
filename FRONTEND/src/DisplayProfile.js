import React, {useState ,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from'./NavBar'
import './DisplayProfile.css'
import Title from './Title';
import axios from 'axios';
import { domain } from './Hostdata';

const DisplayProfile = () => {

    let currentUser="";
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
    const navigate=useNavigate();
    const [profile_name,setprofile_name]=useState('');
    const [posts,setposts]=useState([]);
    let {uname}=useParams();


    const getposts= async (uname)=>{

        const cookie = localStorage.getItem('collab');

        axios.get(`${domain}/posts/get/${uname}`, {
            headers: {
              'Authorization': `Bearer ${cookie}`, // Attach token in Authorization header
            },
          })
        .then(async response => {
          const temposts = response.data;
          console.log("posts:", JSON.stringify(temposts));


        axios.post(domain+'/posts/getposts', { posts: temposts }, {
            headers: {
              'Authorization': `Bearer ${cookie}`, // Attach token in Authorization header
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
        const cookie = localStorage.getItem('collab');
        const fetchData = async () => {
          try {
            console.log("here     :"+username);
            const url=domain+"/profile/displayprofile/"+uname;
            console.log(url);
            const response=await fetch(url,{
            method:"get",
                    headers:{
                        'Authorization': `Bearer ${cookie}`,
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
            currentUser=res1[0];

            setUsername(await res1.username);
            setprofile_name(await res1.profile_name);
            getposts(await res1.username);
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
            //console.log(await res1.skill.split("|")[0].split(","));

            if((await res1.skill)){
                if(await res1.skill.length>0)
                    setskill(await res1.skill.split("|")[0].split(","));
            }
            else{
                setskill([]);
            }
            if((await res1.education)){
                if(await res1.education.length>0)
                console.log("oneone",await res1.education.split("|"))
                    seteducaion(await res1.education.split("|")[0].split(","));
            }
            else{
                seteducaion([]);
            }
            if((await res1.ideas)){
                if(await res1.ideas.length>0)
                    setideas(await res1.ideas.split("|")[0].split(","));
            }
            else{
                setideas([]);
            }   

            console.log("Success");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
          }
        };

        console.log("valid");
        fetchData();
    }, []);



    function Messageclick(){
        console.log("currentUser :",currentUser,"  username :",username);
        if(currentUser===username){
            navigate("/Message");
        }
        else{
            navigate(`/Message/${username}`);
        }
    }

  return (

        <div>
            <NavBar />
            <Title />
            <div id='profilepage'>
                <div id='p1' className='box'>
                    <div  id='p11'className='innerbox'>
                        <div id='userdp'>
                        {profile_name?(<img id='dp'src={profile_name} alt="Error" />)
                            :(<img id='dp'src={require("./logo.jpg")} alt="Error" />)}

                        </div>
                        <div id='p111'>
                            <p>Username     : {username}</p>
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
                            <button id='msg-btn' onClick={Messageclick}>Message</button>
                        </div>
                    </div>
                </div>


                <div id='p2'  className='box'>
                    <div id='skills'  className=' skillsbox'>
                        <h2>SKILLS</h2>
                        <div id='skillslist'>
                            {skill.map((s) => <div className='skill'><p>{s}</p></div> )}
                        </div>
                    </div>
                </div>


                <div id='p3'  className='Dabox'>
                    <div id='p33'  className='Daboutbox'>
                        <h2>ABOUT</h2>
                        <p className='Dabouttxt'>{about}</p>
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
                            posts.length>0?(posts.map((e)=><div className='Dpostdiv'><img src={e.data} />
                            </div>)):(<br/>)
                        }
                    </div>
                </div>
            </div>
        </div>
  )
}

export default DisplayProfile