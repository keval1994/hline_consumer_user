import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categoryAPI } from "../../utils/apiService";
import { IoEyeSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const CategoryList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [IsCategories, setIsCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await categoryAPI.getProductByCategory(categoryId);
        setIsCategories(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleShowProduct = (subCategoryId) => {
    navigate(`/products/${subCategoryId}`);
  };

  return (
    <div className="bg-soft py-10">
      <div className="mx-auto container">
        <h1 className="text-4xl font-extrabold text-center text-[#081F62] mb-14">
          Discover Artistic Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {IsCategories.map((category, index) => (
            <motion.div
              key={category.sub_Category_Id}
              onClick={() => handleShowProduct(category.sub_Category_Id)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={category.sab_Category_Image}
                  alt={category.sub_Category_Name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-sm text-[#081F62] bg-white border border-[#081F62] px-4 py-1 rounded-full shadow">
                    <IoEyeSharp size={14} />
                    <span>View Art</span>
                  </div>
                </motion.div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-[#081F62]">
                  {category.sub_Category_Name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
