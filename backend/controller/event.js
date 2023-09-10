const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const {upload} = require("../multter");
const fs = require("fs");

// create event
router.post(
    "/create-event",upload.array("images") ,
    catchAsyncErrors(async (req, res, next) => {
      try {
        
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
          return next(new ErrorHandler("Shop Id is invalid!", 400));
        } else {

            const files = req.files;
     const imageUrls = files.map((file) => `${file.filename}`);

          
          const productData = req.body;
          productData.images = imageUrls;
          productData.shop = shop;
        
          const event = await Event.create(productData);
  
          res.status(201).json({
            success: true,
            event,
          });
        }
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );

   // get all events of a shop
router.get(
    "/get-all-events/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const events = await Event.find({ shopId: req.params.id });
  
        res.status(201).json({
          success: true,
          events,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );


   // delete product of a shop
router.delete(
    "/delete-shop-event/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        
        const eventData = await Event.findById(req.params.id);

        if (!eventData) {
            return next(new ErrorHandler("L'événement n'a pas été trouvé avec cet identifiant", 404));
        }

        // Supprimer les images associées
        eventData.images.forEach((imgUrl) => {
            const filename = imgUrl;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    // Note : Ne retournez pas une réponse ici. Si une erreur se produit, elle sera traitée à la fin.
                } else {
                    console.log("Le fichier a été supprimé avec succès");
                }
            });
        });

        await Event.findByIdAndDelete(req.params.id);

  
        res.status(201).json({
          success: true,
          message: "Événement supprimé avec succès !",
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );

  // get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
  
// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
  module.exports = router;
