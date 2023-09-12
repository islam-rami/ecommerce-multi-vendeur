import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { BsPencil } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { FaPlusSquare } from "react-icons/fa";
import styles from "../../styles/styles";
import { backend_server, server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";



function AllCategories() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


const [updatedName, setUpdatedName] = useState("");
 
const [updatedImg, setUpdatedImg] = useState("");
const [selectedId, setSelectedId] = useState("");

const handlImgUpdate = (e) => {
    setUpdatedImg(e.target.files[0]);
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setUpdatedImg(file);


    const  newData = new FormData();
    newData.append('img',file)
    newData.append('id',selectedId)

    axios
    .put(
      `${server}/categorie/update-categorie-img`, newData ,
      {  'headers':{ "Content-Type" :"multipart/form-data" ,},
        withCredentials: true,
      }
    )
    .then((res) => {
     
      toast.success("Image mise à jour avec succès !");
      setCategories(res.data.categories);
      setOpenUpdate(false);
    })
    .catch((error) => {
            toast.error(error.response.data.message);
          });
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    const data = new FormData();
  
    data.append("name", updatedName);
    data.append("id", selectedId);

    await axios
    .post(
      `${server}/categorie/update-categorie-name`,
      data,
      { withCredentials: true }
    )
    .then((res) => {

     setOpen(false);
     console.log("res.data :",res.data);

setCategories(res.data.categories);
setOpenUpdate(false);
    // window.location.reload();
    })
    .catch((error) => {
        console.log('error.response :',error);
      toast.error(error.response.data.message);
    });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
  
    data.append("name", name);
    data.append("img", img);

    await axios
    .post(
      `${server}/categorie/add-categorie`,
      data,
      { withCredentials: true }
    )
    .then((res) => {
     toast.success("Catégorie créé avec succès!");
     setOpen(false);
     window.location.reload();
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
  };

  const handleDelete = async (id) => {
   
  

  
    await axios
    .post(
      `${server}/categorie/delet-categorie`, {id : id},
      { withCredentials: true }
    )
    .then((res) => {
     toast.success("Catégorie supprimée avec succès!");
     setCategories(res.data.categories);
     // window.location.reload();
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });

  };



  const handleFileInputChange = (e) => {
    setImg(e.target.files[0]);
  };

    
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/categorie/get-categories`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
      
        setCategories(res.data.data);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);


  const columns = [
    { field: "id", headerName: "Id", minWidth: 300},
    {
        field: "img",
       
        minWidth: 100,
        headerName: "",
       
        sortable: false,
        renderCell: (params) => {
          
          return (
            <div style={{  height: '100px' }} >
              <img src={`${backend_server}/${params.row.img}`}
              style={{ width: '100px', height: '80px', objectFit: 'cover' }} 
              alt="Cell Image"
              />
               
            </div>
          );
        },
      },
    {
      field: "name",
      headerName: "Catégorie",
      minWidth: 180,
     
    },
    {
      field: "Delete",
  
      minWidth: 180,
      headerName: "Supprimer",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() =>{setSelectedId(params.row.id); handleDelete(params.row.id);} }>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "Modifier",

      minWidth: 120,
      headerName: "Modifier",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => { setUpdatedName(params.row.name); setUpdatedImg(params.row.img); setSelectedId(params.row.id); setOpenUpdate(true);}}>
              <BsPencil size={20} />
            </Button>
           
          </>
        );
      },
    },
  ];

  const row = [];

  categories &&
    categories.forEach((item) => {
      row.push({
        id: item._id,
    img: item.img ,
        
        name: item.name,
      
   
      });
    });

//********************************************************* */


  return (
    <>
    {isLoading ? (<Loader />) :(
        <></>
    )}
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <div className="w-full flex justify-end">
        <div
          className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
          onClick={() => setOpen(true)}
        >
          <span className="text-white">Ajouter une catégorie</span>
        </div>
      </div>
      <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            rowHeight={100}
            disableSelectionOnClick
            autoHeight
          />

      {open && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center overflow-y-scroll">
          <div className="w-[90%] 800px:w-[40%] h-[55vh] bg-white rounded-md shadow p-4 ">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">
              Ajouter une catégorie
            </h5>
            {/* create coupoun code */}
            <form onSubmit={handleSubmit} aria-required={true}>
              <br />
              <div>
                <label className="pb-2">
                  catégorie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entrez le nom de votre code promotionnel..."
                />
              </div>
              <br />
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700"
                ></label>
                <div className="mt-2 flex items-center">
                  <span className="inline-block h-40 w-40  overflow-hidden">
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt="avatar"
                        className="h-full w-full object-cover  "
                      />
                    ) : (
                      <FaPlusSquare className="h-8 w-8" />
                    )}
                  </span>
                  <label
                    htmlFor="file-input"
                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>Télécharger un fichier</span>
                    <input
                      type="file"
                      name="img"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileInputChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div>
                  <input
                    type="submit"
                    value="Ajouter"
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      { openUpdate && (<div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center overflow-y-scroll">
          <div className="w-[90%] 800px:w-[40%] h-[55vh] bg-white rounded-md shadow p-4 ">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpenUpdate(false)}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">
              Modifier une catégorie
            </h5>
            {/* create coupoun code */}
            <form onSubmit={handleUpdateName} aria-required={true}>
              <br />
              <div>
                <label className="pb-2">
                  catégorie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={updatedName}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setUpdatedName(e.target.value)}
                  placeholder="Entrez le nom de votre code promotionnel..."
                />
              </div>
              <br />
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700"
                ></label>
                <div className="mt-2 flex items-center">
                  <span className="inline-block h-40 w-40  overflow-hidden">
                    {updatedImg ? (
                      <img
                        src={`${backend_server}${updatedImg}`}
                        alt="avatar"
                        className="h-full w-full object-cover  "
                      />
                    ) : (
                      <FaPlusSquare className="h-8 w-8" />
                    )}
                  </span>
                  <label
                    htmlFor="file-input"
                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>Télécharger un fichier</span>
                    <input
                      type="file"
                      name="img"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImage}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div>
                  <input
                    type="submit"
                    value="Ajouter"
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>)}
    </div>
    </>
  );
}

export default AllCategories;


