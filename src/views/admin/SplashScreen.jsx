// src/components/SplashScreen.js
import  { useEffect, useState } from 'react';
import ninjarunning from "../../assets/gifs/ninjarunning.gif";

const SplashScreen = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 2000); // Adjust timing as needed for your animation
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="splash-screen">
      <img src={ninjarunning} alt="Ninja Running" />
    </div>
  );
};

export default SplashScreen;
