const express = require("express");
const router = express.Router();
const { upload } = require("../multter");
const Categorie = require("../model/categorie");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// add categorie
router.post(
  "/add-categorie",
  isAuthenticated,
  isAdmin("Admin"),
  upload.single("img"),
  async (req, res, next) => {
    try {
      const { name } = req.body;

      const filename = req.file.filename;
      const img = path.join(filename);

      const categorie = await Categorie.create({ name, img });

      res.status(201).json({
        success: true,
        data: categorie,
        message: "Catégorie ajoutée avec succès.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all categories
router.get(
  "/get-categories",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res, next) => {
    try {
      const categories = await Categorie.find();

      res.status(200).json({
        success: true,
        data: categories,
        message: "Catégories récupérées avec succès.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update Categorie  img
router.put(
  "/update-categorie-img",
  upload.single("img"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await Categorie.findById(req.body.id);

      const existavatarpath = `uploads/${existsUser.img}`;

      let old_image_suppretion = "";
      fs.unlink(existavatarpath, (err) => {
        if (err) {
          console.log(err);
          old_image_suppretion = "Erreur dans la suppression du fichier";
        } else {
          old_image_suppretion = "Le fichier a été supprimé avec succès";
        }
      });

      const fileUrl = path.join(req.file.filename);
      const user = await Categorie.findByIdAndUpdate(req.body.id, {
        img: fileUrl,
      });

      categories = await Categorie.find();

      res.status(200).json({
        success: true,
        categories: categories,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update Categorie  name
router.post(
  "/update-categorie-name",
  upload.single("img"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, id } = req.body;
      console.log("req.body :", req.body);
      const categories = await Categorie.findOne({ _id: id });

      if (!categories) {
        return next(new ErrorHandler("catégorie non trouvée", 400));
      }

      categories.name = name;

      await categories.save();

      const c = await Categorie.find();
      res.status(200).json({
        success: true,
        categories: c,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update Categorie  name
router.post("/delet-categorie", catchAsyncErrors(async (req, res, next) => {
    try {
        console.log("existsCategorie :",req.body.id);
        const existsCategorie = await Categorie.findById(req.body.id);
     
        if (!existsCategorie) {
            return next(new ErrorHandler("Catégorie non trouvée", 404));
        }

        const existavatarpath = `uploads/${existsCategorie.img}`;
        let old_image_suppretion = "";
        fs.unlink(existavatarpath, (err) => {
            if (err) {
                console.log(err);
                old_image_suppretion = "Erreur dans la suppression du fichier";
            } else {
                old_image_suppretion = "Le fichier a été supprimé avec succès";
            }
        });

        await Categorie.deleteOne({ _id: req.body.id });


        const c = await Categorie.find();
        res.status(200).json({
            success: true,
            categories: c,
            msg: old_image_suppretion,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));


module.exports = router;
