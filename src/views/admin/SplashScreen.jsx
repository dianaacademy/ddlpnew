import { useEffect } from "react";
import PropTypes from "prop-types";
import success from "../../assets/gifs/achieve.gif";

const SplashScreen = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 2000); // Adju   st timing as needed for your animation
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="splash-screen">
      <img src={success} alt="Ninja Running" />
    </div>
  );
};

// Define prop types
SplashScreen.propTypes = {
  onAnimationEnd: PropTypes.func.isRequired, // Ensure this prop is a function and mandatory
};

export default SplashScreen;
