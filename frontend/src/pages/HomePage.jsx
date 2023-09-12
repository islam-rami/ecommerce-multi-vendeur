import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import Events from "../components/Events/Events";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/product";
function HomePage() {
  
  const dispatch = useDispatch();

  useEffect(() => {
 
    dispatch(getAllProducts());
    window.scrollTo(0, 0);
   
  }, []);
  return (
    <div>
        <Header activeHeading={1} />
        <Hero />
        <Categories />
        <BestDeals />
        <Events />
        <FeaturedProduct />
        <Sponsored />
        <Footer />
    </div>
   
  )
}

export default HomePage