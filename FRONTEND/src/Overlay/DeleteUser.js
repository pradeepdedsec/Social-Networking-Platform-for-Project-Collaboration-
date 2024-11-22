import React from 'react';
import './DeleteUser.css';

const DeleteUser = ({ isOpen, onClose,deluser }) => {
  return (
    <div className={isOpen ? 'overlay open' : 'overlay'} onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure to delete this Account</h2>
        <button className='userdelbtn'  onClick={deluser}>Yes</button>
        <button className='userdelbtn' onClick={onClose}>NO</button>
      </div>
    </div>
  );
};

export default DeleteUser;