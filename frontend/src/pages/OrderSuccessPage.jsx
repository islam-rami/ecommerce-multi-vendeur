import React, { useEffect } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "lottie-react";
import animationData from "../Assests/animations/animation_lleo2e20.json";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
 
    window.scrollTo(180, 180);
   
  }, []);
  return (
    <div className="w-[full] h-screen flex  flex-col items-center justify-center">
      <Lottie animationData={animationData}  style={{ width: 300, height: 300 }}/>
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
      La commande a été effectuée avec succès😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
