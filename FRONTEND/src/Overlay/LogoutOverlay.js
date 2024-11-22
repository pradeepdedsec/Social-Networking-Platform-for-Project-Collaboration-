import React from 'react';
import './logoutoverlay.css';

const LogoutOverlay = ({ isOpen, onClose,logout }) => {
  return (
    <div className={isOpen ? 'overlay open' : 'overlay'} onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <h2>Are you want to logout</h2>
        <button className='yesnobtn' onClick={logout}>Yes</button>
        <button className='yesnobtn' onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default LogoutOverlay;