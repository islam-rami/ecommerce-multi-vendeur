import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";

function CreateProduct() {
    const { seller } = useSelector((state) => state.seller);
    const { success, error } = useSelector((state) => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState();
    const [discountPrice, setDiscountPrice] = useState();
    const [stock, setStock] = useState();

    useEffect(() => {
      if (error) {
        toast.error(error);
      }
      if (success) {
        toast.success("Produit créé avec succès !");
        navigate("/dashboard");
        window.location.reload();
      }
    }, [dispatch, error, success]);



    const [categories, setCategories] = useState([]);


    useEffect(() => {
   
      axios
        .get(`${server}/categorie/get-categories`, {
          withCredentials: true,
        })
        .then((res) => {
      
        
          setCategories(res.data.data);
        })
        .catch((error) => {
     
        });
    }, []);
  

    const handleSubmit = (e) => {
      e.preventDefault();
  
      const newForm = new FormData();
  
      images.forEach((image) => {
        newForm.append("images", image);
      });
      newForm.append("name", name);
      newForm.append("description", description);
      newForm.append("category", category);
      newForm.append("tags", tags);
      newForm.append("originalPrice", originalPrice);
      newForm.append("discountPrice", discountPrice);
      newForm.append("stock", stock);
      newForm.append("shopId", seller._id);

      console.log("imagess: ",images);
     
      for (let [key, value] of newForm.entries()) { 
        console.log(key, value);
    }
    
      dispatch(
        createProduct(newForm)
      );
    };
  

      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
    
        setImages((prev)=> [...prev,...files])
      };
    
      return (
        <div className="w-[90%] 800px:w-[55%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
          <h5 className="text-[30px] font-Poppins text-center">Créer un produit</h5>
          {/* create product form */}
          <form onSubmit={handleSubmit}>
            <br />
            <div>
              <label className="pb-2">
              Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={name}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setName(e.target.value)}
                placeholder="Saisissez le nom de votre produit événementiel..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
              Description <span className="text-red-500">*</span>
              </label>
              <textarea
                cols="30"
                required
                rows="8"
                type="text"
                name="description"
                value={description}
                className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Saisissez la description de votre produit événementiel..."
              ></textarea>
            </div>
            <br />
            <div>
              <label className="pb-2">
              Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full mt-2 border h-[35px] rounded-[5px]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Choose a category">Choisissez une catégorie</option>
                {categories &&
                  categories.map((i,index) => (
                    <option value={i.name} key={i.index}>
                      {i.name}
                    </option>
                  ))}
              </select>
            </div>
            <br />
            <div>
              <label className="pb-2">Étiquettes</label>
              <input
                type="text"
                name="tags"
                value={tags}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setTags(e.target.value)}
                placeholder="Saisissez les étiquettes de votre produit événementiel..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">Prix d'origine</label>
              <input
                type="number"
                name="price"
                value={originalPrice}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Saisissez le prix de votre produit événementiel..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
              Prix (avec réduction) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={discountPrice}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Saisissez le prix de votre produit événementiel avec réduction..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
              Stock du produit<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={stock}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setStock(e.target.value)}
                placeholder="Saisissez le stock de votre produit événementiel..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
              Téléchargez des images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name=""
                id="upload"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
              <div className="w-full flex items-center flex-wrap">
                <label htmlFor="upload">
                  <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
                </label>
                {images &&
                  images.map((i) => (
                    <img
                      src={URL.createObjectURL(i)}
                      key={i}
                      alt=""
                      className="h-[120px] w-[120px] object-cover m-2"
                    />
                  ))}
              </div>
              <br />
              <div>
                <input
                  type="submit"
                  value="Create"
                  className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </form>
        </div>
      );

}

export default CreateProduct