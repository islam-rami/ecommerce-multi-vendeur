const express = require("express");
const path = require("path");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const sendShopToken = require("../utils/sendShopToken");
const Shop = require("../model/shop");
const fs = require("fs");
const {upload} = require("../multter");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Product = require("../model/product");

// create shop
router.post("/create-shop", upload.single("file") , catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;
      const sellerEmail = await Shop.findOne({ email });
      if (sellerEmail) {
        const filename= req.file.filename;
        const filePath= `uploads/${filename}`;
        fs.unlink(filePath,(err) => {
            if(err) {
                console.log(err);
                res.status(500).json({message : "Erreur dans la suppression du fichier"});
            } else {
                res.status(200).json({message : "Le fichier a été supprimé avec succès"});
            }
        });
        return next(new ErrorHandler("L'utilisateur existe déjà", 400));
    }
      
    const filename= req.file.filename;
    const fileUrl= path.join(filename);
  
      const seller = {
        name: req.body.name,
        email: email,
        password: req.body.password,
        avatar: fileUrl ,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        zipCode: req.body.zipCode,
      };
      console.log(seller);
  
      const activationToken = createActivationToken(seller);
      const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;
  
     
  
      try {
        await sendMail({
          email: seller.email,
          subject: "Activate your Shop",
          message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- ${seller.email} to activate your shop!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }));
  
// create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m",
    });
  };

  // activate user
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
      try {

        console.log('ggggggggggg');
        const { activation_token } = req.body;
        
        const newSeller = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET
          );
        console.log("iii",newSeller);
        if (!newSeller) {
          return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;
  
        let seller = await Shop.findOne({ email });
  
        if (seller) {
          return next(new ErrorHandler("User already exists", 400));
        }
  
        seller = await Shop.create({
          name,
          email,
          avatar,
          password,
          zipCode,
          address,
          phoneNumber,
        });
  
        sendShopToken(seller, 201, res);
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

  // login shop
router.post(
    "/login-shop",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { email, password } = req.body;
  
        if (!email || !password) {
          return next(new ErrorHandler("Veuillez remplir tous les champs !", 400));
        }
  
        const user = await Shop.findOne({ email }).select("+password");
  
        if (!user) {
          return next(new ErrorHandler("L'utilisateur n'existe pas!", 400));
        }
  
        const isPasswordValid = await user.comparePassword(password);
  
        if (!isPasswordValid) {
          return next(
            new ErrorHandler("Veuillez fournir les informations correctes.", 400)
          );
        }
  
        sendShopToken(user, 201, res);
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  
  // load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
       
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// update shop avatar
router.put( "/update-shop-avatar", isSeller, upload.single("image") ,
  catchAsyncErrors(async (req, res, next) => {
    try {
      
      const existsUser = await Shop.findById(req.seller._id);
    
      
      const existavatarpath=`uploads/${existsUser.avatar}`;
    
      let old_image_suppretion= "" ;
      fs.unlink(existavatarpath,(err) => {
        if(err) {
            console.log(err);
            old_image_suppretion="Erreur dans la suppression du fichier";
         
        } else {
          old_image_suppretion="Le fichier a été supprimé avec succès" ;
          
        }
    });
    
      const fileUrl = path.join(req.file.filename);
      const user =await  Shop.findByIdAndUpdate(req.seller._id,{avatar :fileUrl});



      const updatedProducts = await Product.updateMany(
        { "shop._id": req.seller._id },  // filter by shop's shopId
        { $set: { "shop.avatar": fileUrl } } // update the shop avatar field for all matching documents
    );
    
    if (updatedProducts.nModified === 0) { // Check if any documents were actually modified
        console.log("No products found with the specified shopId or no new changes to be made.");
        return;
    }
      

    const updatedEvents = await Event.updateMany(
      { "shop._id": req.seller._id },  // filter by shop's shopId
      { $set: { "shop.avatar": fileUrl } } // update the shop avatar field for all matching documents
  );

  
      res.status(200).json({
        success: true,
        user: user,
        suppretionimage: old_image_suppretion ,
      });

    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// update seller info

router.put("/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
    
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler( "Aucun vendeur trouvé avec cet identifiant", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;
