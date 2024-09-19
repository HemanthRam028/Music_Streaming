import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    // Navigate to the home page
    navigate('/home'); 

    // Force the page to reload
    window.location.reload(); 
  };

  return (
    <button onClick={handleHomeClick}>
      Home
    </button>
  );
};

export default HomeButton;
