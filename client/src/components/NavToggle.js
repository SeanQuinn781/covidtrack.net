import React from 'react';

const NavToggle = () => {
  return (
    <button 
      className="navbar-toggler" 
      type="button" 
      data-toggle="collapse" 
      data-target="#navbarSupportedContent" 
      aria-controls="navbarSupportedContent" 
      aria-expanded="false" 
      aria-label="Toggle navigation"
      style={{color:'#fff !important'}}
    >
      <span className="navbar-toggler-icon"> 
        <i className="fas fa-bars fa-1x" />
      </span>
    </button>
  )
}
export default NavToggle;
