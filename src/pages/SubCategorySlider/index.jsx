import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subCategoryAPI } from "../../utils/apiService";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import Marquee from "react-fast-marquee";

const SubCategorySlider = () => {
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await subCategoryAPI.getAllSubCategory();
        setSubCategories(data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-6xl font-bold text-[#051747] mb-10 tracking-tight text-center"
      >
        Discover Artistic Collections
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="text-lg md:text-xl text-[#535F7C] mb-10 text-center max-w-2xl"
      >
        Explore handcrafted creations curated for the true art lover in you.
      </motion.p>

      <Marquee pauseOnHover speed={40} gradient={false} className="w-full">
        {subCategories.concat(subCategories).map((subCategory, index) => (
          <div
            key={index}
            className="group cursor-pointer inline-block relative mx-3"
          >
            <div className="w-[250px] h-[250px] overflow-hidden relative rounded-lg border border-[#05174733] group-hover:shadow-xl transition-all duration-300">
              <img
                src={subCategory.sab_Category_Image}
                alt={subCategory.sub_Category_Name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ease-in-out rounded-lg"
              />
              <div className="absolute bottom-0 left-0 w-full h-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-[#ffffffcc] rounded-b-lg flex flex-col items-center justify-center backdrop-blur-sm shadow-lg space-y-1">
                <p className="text-[#051747] font-medium text-xl text-center tracking-wider">
                  {subCategory.sub_Category_Name}
                </p>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/productlist/${subCategory.sub_Category_Id}`}
                    className="text-primary text-lg cursor-pointer transition-transform duration-300 group-hover:text-accent group-hover:scale-125 group-hover:rotate-6"
                  >
                    <FaEye />
                  </Link>
                  <span className="text-primary font-medium group-hover:text-accent text-sm">
                    View
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default SubCategorySlider;
