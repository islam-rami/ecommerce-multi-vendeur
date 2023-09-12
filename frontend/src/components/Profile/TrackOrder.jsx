import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      {" "}
      <>
        {data && data?.status === "Processing" ? (
          <h1 className="text-[20px]">Votre commande est en cours de traitement dans la boutique.</h1>
        ) : data?.status === "Transferred to delivery partner" ? (
          <h1 className="text-[20px]">
           Votre commande est en route vers le service de livraison.
          </h1>
        ) : data?.status === "Shipping" ? (
          <h1 className="text-[20px]">
            Votre commande est en chemin avec notre partenaire de livraison.
          </h1>
        ) : data?.status === "Received" ? (
          <h1 className="text-[20px]">
         Votre commande est dans votre ville. Notre livreur vous la remettra.
          </h1>
        ) : data?.status === "On the way" ? (
          <h1 className="text-[20px]">
            Notre livreur est en route pour vous livrer votre commande.
          </h1>
        ) : data?.status === "Delivered" ? (
          <h1 className="text-[20px]">Votre commande a été livrée !</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px]">Votre remboursement est en cours !</h1>
        ) : data?.status === "Refund Success" ? (
          <h1 className="text-[20px]">Votre remboursement a été effectué avec succès !</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
