import Login from './Login'
import Register from './Register'
import NavBar from './NavBar';
import { Link,Route,Routes } from 'react-router-dom';
import Profile from './Profile';
import Home from './Home';
import Forgotpass from './Forgotpass'
import UpdateProfile from './UpdateProfile';
import Search from './Search';
import DisplayProfile from './DisplayProfile';
import Feedback from './Feedback';
import Recommendation from './Recommendation';

import AdminLogin from './admin/AdminLogin'
import AdminHome from './admin/AdminHome';
import AdminSearch from './admin/AdminSearch';
import AdminDisplayProfile from './admin/AdminDisplayProfile';
import AdminFeedback from './admin/AdminFeedback';
import Message from './Message';
import Request from './Request';
import AdminForgotpass from './admin/AdminForgotpass';
import AdminDisplayMsgs from './admin/AdminDisplayMsgs';
import Test from './Test';
import { useEffect } from 'react';

const App =() =>{
  useEffect(()=>{
    console.log("hostname :",window.location);
  },[])

  return <>
  <Routes>
  <Route path="/Home" element={<Home/>}/ >
    <Route path="/" element={<Home/>}/ >
    <Route path="/Login" element={<Login/>}/ >
    <Route path="/Register" element={<Register/>}/ >
    <Route path="/Forgotpassword" element={<Forgotpass/>}/ >
    <Route path="/Profile" element={<Profile/>}></Route>
    <Route path="/Profile/:oldFile" element={<Profile/>}></Route>
    <Route path="/UpdateProfile" element={<UpdateProfile/>}/>
    <Route path="/Search" element={<Search/>}/>
    <Route path="/DisplayProfile/:uname" element={<DisplayProfile/>}/>
    <Route path="/Feedback" element={<Feedback/>}/>
    <Route path="/Message" element={<Message/>}/>
    <Route path="/Message/:msgto" element={<Message/>}/>
    <Route path="/Request" element={<Request/>}/>
    <Route path="/Recommendation" element={<Recommendation/>}/>
    <Route path="/Test" element={<Test/>}/>


    <Route path="/AdminHome" element={<AdminHome/>}/ >
    <Route path="/AdminLogin" element={<AdminLogin/>}/ >
    <Route path="/AdminForgotpass" element={<AdminForgotpass/>}/ >
    <Route path="/AdminSearch" element={<AdminSearch/>}/>
    <Route path="/AdminDisplayProfile/:uname" element={<AdminDisplayProfile/>}/>
    <Route path="/AdminFeedback" element={<AdminFeedback/>}/>
    <Route path="/AdminDisplayMsgs" element={<AdminDisplayMsgs/>}/>
    <Route path='*' element={<Login/>} />

  </Routes>
  </>
}

export default App;