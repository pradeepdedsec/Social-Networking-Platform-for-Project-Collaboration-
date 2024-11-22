import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import styles from "./UpdateProfile.module.css";
import { Button, Chiptag, InputField, RadioButton,TEXTAREA } from "./components/CustomInputs";
import { IoIosClose } from "react-icons/io";
import Title from "./Title";
import axios from 'axios';
import { domain } from "./Hostdata";

const UpdateProfile = () => {
  const [isverified, setverified] = useState(false);
  const [username,setusername]=useState("");
  const [name, setname] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");
  const [dob, setdob] = useState("");
  const [skill, setskill] = useState([]);
  const [sk, sets] = useState("");
  const [email, setemail] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [about, setabout] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [country, setcountry] = useState("");
  const [education, seteducaion] = useState([]);
  const [ed, seted] = useState("");
  const [ideas, setideas] = useState([]);
  const [ide, setide] = useState("");
  const navigate = useNavigate();
  const [msg,setMsg]=useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if(!selectedFile)
        return;
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const cookie = localStorage.getItem('collab');
      console.log(`${domain}/profilepic/upload/${username}`);
      const response = await axios.post(`${domain}/profilepic/upload/${username}`, formData, {
        headers: {
          "Authorization":`Bearer ${cookie}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Image uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    console.log("first");
    const fetchData = async () => {
      try {
        const cookie = localStorage.getItem('collab');
        const response = await fetch(
          domain+"/profile/getprofile",
          {
            method: "get",
            headers: {
              "Authorization":`Bearer ${cookie}`,
              "Content-Type": "application/json",
            }
          }
        );
        const res = await response.json();
        console.log(res);
        let res1 = await res;
        if ((await res1.message) === "Unauthorized") {
          navigate("/Login");
        }
        if (await res1.name) {
          setverified(true);
        }
        setusername(await res1.username);
        setname(await res1.name);
        console.log(await res1.age);
        setage(!(await res1.age===null)?await res1.age:"");
        setgender(await res1.gender)
          if(await res1.dob){
            if(await res1.dob.length>0){
              console.log("one :"+await res1.dob)
              setdob(await res1.dob);
              console.log("two :"+dob);
            }
          }

        setemail(await res1.email);
        setphone_number(!(await res1.phone_number===null)?await res1.phone_number:"");
        setabout(!(await res1.about===null)?await res1.about:"");
        setcity(!(await res1.city===null)?await res1.city:"");
        setstate(!(await res1.state===null)?await res1.state:"");
        setcountry(!(await res1.country===null)?await res1.country:"");
        if(await res1.skill)
          setskill(await res1.skill.split(","));
        if(await res1.education)
            seteducaion(await res1.education.split(","));
        if(await res1.ideas)
          setideas(await res1.ideas.split(","));
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);
  console.log("valid");


  function addSkill() {
    if (sk.length > 0 && !skill.includes(sk)) setskill([...skill, sk]);
    sets("");
    console.log(skill);
  }

  function addEdu() {
    if (ed.length > 0 && !education.includes(ed))
      seteducaion([...education, ed]);
    seted("");
    console.log(education);
  }

  function addIde() {
    if (ide.length > 0 && !ideas.includes(ide)) setideas([...ideas, ide]);
    setide("");
    console.log(ideas);
  }

  async function sendtest() {
    
    if(name.length===0 || email.length===0){
      setMsg("Name and Email are requied feilds");
      return;
    }
    await handleSubmit();
    if (name.length > 0) {
      let fskills = "";

      for (let i = 0; i < skill.length; i++) {
        if (skill[i].includes(",")) {
          skill[i] = skill[i].replace(",", " ");
        }
      }

      for (let i = 0; i < skill.length; i++) {

        if (skill[i].includes(",")) {
          skill[i] = skill[i].replace(",", " ");
        }

        fskills = fskills + skill[i];

        if (!(i === skill.length - 1)) fskills = fskills + ",";
      }

      let fedu = "";
      for (let i = 0; i < education.length; i++) {

        if (education[i].includes(",")) {
          education[i] = education[i].replace(",", " ");
        }

        fedu = fedu + education[i];

        if (!(i === education.length - 1)) fedu = fedu + ",";
      }

      let fide = "";
      for (let i = 0; i < ideas.length; i++) {

        if (ideas[i].includes(",")) {
          ideas[i] = ideas[i].replace(",", " ");
        }

        fide = fide + ideas[i];

        if (!(i === ideas.length - 1)) fide = fide + ",";
      }


      let t = {
        name,
        age,
        gender,
        dob,
        "skill":fskills,
        email,
        phone_number,
        about,
        city,
        state,
        country,
        "education":fedu,
        "ideas":fide
      };

      console.log(t);

      const cookie = localStorage.getItem('collab');
      const response = await fetch(
        domain+"/profile/updateProfile",
        {
          method: "post",
          headers: {
            "Authorization":`Bearer ${cookie}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(t),
        }
      );
      navigate("/Profile");
    }
  }

  function removeskill(k) {
    setskill(removeElementByValue(skill, k));
  }

  function removeElementByValue(array, value) {
    return array.filter((item) => item !== value);
  }

  return (
    <>
      <NavBar />
      <Title />
      <div className={styles.Container}>
        {/* <button className='logout' onClick={handlelogout}>Logout</button> */}
        <h2>Profile Update:</h2>
        <section className={styles.Content_container}>
          <div className={styles.LeftContainer}>
            <InputField name={"Name"} value={name} handleOnchange={(e) => setname(e.target.value)} />
            <InputField name={"age"} value={age} handleOnchange={(e) => setage(e.target.value)}/>
            <label style={{fontWeight:"bold",marginLeft:"10px",fontSize:"1.2rem"}} htmlFor="gend">Gender:</label>
            <br />
            <select value={gender} style={{padding: "10px",border: "none",background: "var(--base-color)",outline: "none",borderRadius: "8px",minWidth: "250px",marginLeft:"10px"}} id="gend" onChange={(e) => setgender(e.target.value)} >
                  <option value="">SELECT-GENDER</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                </select><br/>
            <InputField name={"DOB"} value={dob} type={"date"} handleOnchange={(e) => setdob(e.target.value)}/>
            <InputField name={"Email"} value={email} type={"email"} handleOnchange={(e) => setemail(e.target.value)} />
            <InputField name={"Phone No"} value={phone_number} type={"tel"} handleOnchange={(e) => setphone_number(e.target.value)}/>
            <InputField name={"City"} value={city} handleOnchange={(e) => setcity(e.target.value)}/>
            <InputField name={"State"} value={state} handleOnchange={(e) => setstate(e.target.value)}/>
            <InputField name={"Country"} value={country} handleOnchange={(e) => setcountry(e.target.value)}/>
          </div>
          <div className={styles.rightContainer}>
            <TEXTAREA name={"about"} value={about} handleOnchange={(e) => setabout(e.target.value)}/>
            <span className={styles.InputWrapper}>
              <InputField
                type="text"
                value={sk}
                handleOnchange={(e) => sets(e.target.value)}
                placeholder="skill"
                name="Skills"
              />
              <Button handleClick={addSkill} name={"Add"} />
            </span>
            <div className={styles.tagsContainer}>
              {skill.map((item, k) => (
                <Chiptag
                  Icon={<IoIosClose />}
                  name={item}
                  id={k}
                  handleClick={()=>setskill(removeElementByValue(skill, item))}
                />
              ))}
            </div>
            <span className={styles.InputWrapper}>
              <InputField
                type="text"
                value={ed}
                handleOnchange={(e) => seted(e.target.value)}
                placeholder="education"
                name="Education"
              />
              <Button
                handleClick={addEdu}
                name={"Add"}
                CustclassName={styles.ButtonAddClass}
              />
            </span>

            <div className={styles.tagsContainer}>
              {education.map((e, k) => (
                <Chiptag
                  Icon={<IoIosClose />}
                  name={e}
                  id={k}
                  handleClick={()=>seteducaion(removeElementByValue(education, e))}
                />
              ))}
            </div>

            <span className={styles.InputWrapper} style={{gap:"20px",  margin: "var(--Global-padding)"}}>
              <textarea
                type="text"
                value={ide}
                onChange={(e) => setide(e.target.value)}
                placeholder="project ideas"
                className={styles.textareafield}
              />
              <Button
                handleClick={addIde}
                name={"Add"}
                CustclassName={styles.ButtonAddClass}
              />
            </span>

            <div className={styles.tagsContainer}>
              {ideas.map((e, k) => (
                <Chiptag
                  Icon={<IoIosClose />}
                  name={e}
                  id={k}
                  handleClick={()=>setideas(removeElementByValue(ideas, e))}
                />
              ))}
            </div>
    
            <div style={{backgroundColor:"var(--base-color)",width:"250px",height:"50px",marginLeft:"18px",borderRadius:"10px",padding:"15px"}}>
               <input  type="file" onChange={handleFileChange} />
              </div>  
            
          </div>
        </section>
        <div>
            <p style={{textAlign:"center",marginTop:"15px",marginBottom:"0px",fontSize:"12px"}}>{msg}</p>
        </div>
        <Button name={"Update"} handleClick={sendtest} />
      </div>
    </>
  );
};

export default UpdateProfile;
