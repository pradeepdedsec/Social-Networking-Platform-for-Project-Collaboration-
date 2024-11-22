import React from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { VscFeedback } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";

const NavBar = () => {
  return (
    <div className='nav'>
                <div className='home'>
                    <Link to="/Home"><FaHome   className='icon-logo' /></Link>
                </div>

                <div className='msg'>
                    <Link to="/Message"><IoMdChatbubbles   className='icon-logo' /></Link>
                </div>

                <div className='search'>
                    <Link to="/Search"><FaSearch   className='icon-logo' /></Link>
                </div>

                <div className='profile'>
                    <Link to="/Profile"><CgProfile   className='icon-logo' /></Link>
                </div>
                {/*<div className='recommendation' >
                    <Link className='icon-logo' to="/Recommendation"><IoMdNotifications /></Link>
                </div>
                */}

                <div className='recommendation' >
                    <Link to="/Recommendation"><FaUserFriends   className='icon-logo' /></Link>
                </div>

                <div className='feedback' >
                    <Link to="/Feedback"><VscFeedback   className='icon-logo' /></Link>
                </div>

            </div>
  )
}

export default NavBar