const express = require("express");
const User = require("../model/user");
const router = express.Router();
const {upload} = require("../multter");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create user
router.post("/create-user", upload.single("file") , async (req, res, next) => {
    try {
      const { name, email, password ,file} = req.body;
 const userEmail = await User.findOne({ email });
  
       if (userEmail) {
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
      const user = {
        name: name,
        email: email,
        password: password,
        a:filename,
        avatar: fileUrl
      };

  const activationToken = createActivationToken(user);

  const activationUrl = `http://localhost:3000/activation/${activationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Activez votre compte",
      message: `Bonjour ${user.name}, veuillez cliquer sur le lien pour activer votre compte : ${activationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `Veuillez vérifier votre e-mail : ${user.email} pour activer votre compte !`     ,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
  
} catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
  });

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
     

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("L'utilisateur existe déjà", 400));
      }
      user = await User.create({ name, email, avatar,password,});
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Veuillez remplir tous les champs !", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("L'utilisateur n'existe pas !", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Veuillez fournir les informations correctes.", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

  
// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    
    try {

const { wishlistItems, id ,cartItems } = req.query;
let updatedWishlistItems = Array.isArray(wishlistItems) && wishlistItems.length ? wishlistItems : [];

const user = await User.findOneAndUpdate(
    { _id: id },  // Critère de recherche
    { wishlistItems: updatedWishlistItems },  // Mise à jour des données
    { new: true }  // Option pour renvoyer le document mis à jour
);



     let updatedCartItems = Array.isArray(cartItems) && cartItems.length ? cartItems : [];

     const us = await User.findOneAndUpdate(
         { _id: id },  // Critère de recherche
         { cartItems: updatedCartItems },  // Mise à jour des données
         { new: true }  // Option pour renvoyer le document mis à jour
     );
     
    

      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
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



// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// update user avatar
router.put("/update-avatar", isAuthenticated, upload.single("image") ,
  catchAsyncErrors(async (req, res, next) => {
    try {
      
      const existsUser = await User.findById(req.user.id);
    
      
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
      const user =await  User.findByIdAndUpdate(req.user.id,{avatar :fileUrl});
      
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


// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} L'adresse existe déjà.`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("L'ancien mot de passe est incorrect !", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Les mots de passe ne correspondent pas !", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message:"Mot de passe mis à jour avec succès !",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("L'utilisateur n'est pas disponible avec cet identifiant.", 400)
        );
      }

      // const imageId = user.avatar.public_id;

      // await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Utilisateur supprimé avec succès !",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;
