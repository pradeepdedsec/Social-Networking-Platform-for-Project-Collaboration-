import React from 'react'
import './AdminNavBar.css'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { VscFeedback } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

const NavBar = () => {
  return (
    <div className='nav'>
                <div className='home'>
                    <Link to="/AdminHome">< FaHome className='icon-logo' /></Link>
                </div>

                <div className='search'>
                    <Link to="/AdminSearch"><FaSearch className='icon-logo' /></Link>
                </div>

                <div className='msg'>
                    <Link to="/AdminDisplayMsgs"><IoMdChatbubbles className='icon-logo' /></Link>
                </div>

                <div className='feedback' >
                    <Link to="/AdminFeedback"><VscFeedback className='icon-logo' /></Link>
                </div>

            </div>
  )
}

export default NavBar