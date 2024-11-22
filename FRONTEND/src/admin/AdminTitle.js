import React, { useState } from 'react';
import './AdminTitle.css';
import { useNavigate } from 'react-router-dom';
import LogoutOverlay from '../Overlay/LogoutOverlay';
import Cookies from 'js-cookie';


const AdminTitle = () => {

  const navigate=useNavigate();
  const [isOpen, setIsOpen] = useState(false);


  function handlelogout(){
    localStorage.removeItem("collab");
    console.log("entered");
    navigate("/AdminLogin");
  }

  const openOverlay = () => {
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
  };


  return (
    <div className='atitlebox'>
        <h1>COLLAB FINDER</h1>
        <button className='alogoutbtn' onClick={()=>setIsOpen(true)}>Logout</button>
        <LogoutOverlay logout={handlelogout} isOpen={isOpen} onClose={closeOverlay} />
    </div>
  )
}

export default AdminTitle