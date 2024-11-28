// src/components/SplashScreen.js
import  { useEffect } from 'react';
import ninjarunning from "../../assets/gifs/ninjarunning.gif";
import success from "../../assets/gifs/achieve.gif";

const SplashScreen = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 2000); // Adjust timing as needed for your animation
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="splash-screen">
      <img src={success} alt="Ninja Running" />
    </div>
  );
};

export default SplashScreen;
