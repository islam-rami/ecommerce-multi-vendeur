const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Entrez le nom de la catégorie"],
        unique: true,
    },
    img:{
        type: String,
        required: true,
    },
   
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("categorie", categorieSchema);