import React from 'react';
import './postdel.css';

const Postdel = ({ isOpen, onClose,posname,delpos }) => {
  return (
    <div className={isOpen ? 'overlay open' : 'overlay'} onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure to delete this post</h2>
        <button className='postdelbtn' onClick={()=>delpos(posname)}>Yes</button>
        <button className='postdelbtn' onClick={onClose}>NO</button>
      </div>
    </div>
  );
};

export default Postdel;