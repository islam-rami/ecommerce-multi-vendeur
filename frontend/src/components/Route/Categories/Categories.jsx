import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import { backend_server } from "../../../server";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
        >
          
              <div className="flex items-start"  >
                <img src={ `${backend_server}/mega/Livraison_gratuite.svg`} alt="" />
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">Livraison gratuite</h3>
                  <p className="text-xs md:text-sm">Pour toutes commandes de plus de 100€</p>
                </div>
              </div>
              <div className="flex items-start"  >
                <img src={ `${backend_server}/mega/Offres_surprises.svg`} alt="" />
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">Offres surprises du jour</h3>
                  <p className="text-xs md:text-sm">Économisez jusqu'à 25%</p>
                </div>
              </div>
              <div className="flex items-start"  >
                <img src={ `${backend_server}/mega/Prix_abordables.svg`} alt="" />
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">Prix abordables</h3>
                  <p className="text-xs md:text-sm">Prix_abordables.svg</p>
                </div>
              </div>
              <div className="flex items-start"  >
                <img src={ `${backend_server}/mega/aiements_securises.svg`} alt="" />
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">Paiements sécurisés</h3>
                  <p className="text-xs md:text-sm">Paiements 100% protégés</p>
                </div>
              </div>
            
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <h5 className={`text-[18px] leading-[1.3]`}>{i.title}</h5>
                  <img
                    src={i.image_Url}
                    className="w-[120px] object-cover"
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
