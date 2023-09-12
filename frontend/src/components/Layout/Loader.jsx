import React from "react";
import Lottie from "lottie-react";
import animationData from "../../Assests/animations/animation_lla0sw9y.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie animationData={animationData} width={300} height={300} />
      
    </div>
  );
};

export default Loader;
