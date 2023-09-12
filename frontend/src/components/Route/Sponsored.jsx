import React from "react";
import styles from "../../styles/styles";
import { backend_server } from "../../server";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-start">
          <img
            src={`${backend_server}/mega/Sony-Logo.png` }
            alt=""
            style={{width:"150px", objectFit:"contain"}}
          />
        </div>
        <div className="flex items-start">
          <img
            src={`${backend_server}/mega/Dell-Logo-1989-2016.png` }
            style={{width:"150px", objectFit:"contain"}}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src={`${backend_server}/mega/2560px-LG_logo.png` }
            style={{width:"150px", objectFit:"contain"}}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img  
            src={`${backend_server}/mega/apple-ar21.png` }
            style={{width:"150px", objectFit:"contain"}}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img   
            src={`${backend_server}/mega/mecrosoft.png` }
            style={{width:"150px", objectFit:"contain"}}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
