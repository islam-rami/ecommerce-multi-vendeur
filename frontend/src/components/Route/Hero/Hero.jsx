import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import hero_c from "../../../media/hero2.jpg"
const Hero = () => {
  return (
    <div
      className={`relative min-h-[60vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex} justify-start`}
      style={{
        backgroundImage: `url(${hero_c})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textAlign: 'left' // Ajout de cette ligne
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%] pr-100`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
         Découvrez MegaMart!<br /> 
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
        &nbsp;&nbsp;&nbsp;&nbsp;Votre destination incontournable
         pour un shopping en ligne d'exception. Découvrez une sélection minutieuse de produits
          diversifiés, allant de la mode à la technologie. Plongez dans une expérience unique de 
          shopping en ligne avec MegaMart.
        </p>
        <Link to="/products" className="inline-block ">
            <div className={`${styles.button} mt-12`} style={{ width:'200px' }}>
                 <span className="text-[#fff] font-[Poppins] text-[18px] ">
                 Acheter maintenant
                 </span>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
