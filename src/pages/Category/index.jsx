import { useEffect, useState } from "react";
import { categoryAPI } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { GiChestnutLeaf } from "react-icons/gi";

const Category = () => {
  const navigate = useNavigate();
  const [IsCategories, setIsCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAllCategory();
        setIsCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const cardVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.5 },
    },
  };

  const splitTitle = (title) =>
    title.split("").map((char, index) =>
      char === " " ? (
        " "
      ) : (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 200, damping: 20 },
            },
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      )
    );
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-center text-4xl font-bold mb-14 text-primary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 20,
              },
            },
          }}
        >
          {splitTitle("Curated Art Categories")}
          <div className="flex items-center justify-center mt-4">
            <div className="w-20 h-px bg-gray-300"></div>
            <GiChestnutLeaf className="text-3xl text-gray-600 mx-4 animate-spin-slow" />
            <div className="w-20 h-px bg-gray-300"></div>
          </div>
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {IsCategories.map((item) => (
            <motion.div
              key={item.category_Id}
              className="relative rounded-3xl shadow-lg overflow-hidden group cursor-pointer"
              whileHover="hover"
              variants={cardVariants}
              onClick={() => navigate(`/category/${item.category_Id}`)}
            >
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={item.category_Image}
                  alt={item.category_Name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-black/10 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 bg-white backdrop-blur-md ">
                  <h3 className="text-2xl font-bold text-[#081F62] mb-2">
                    {item.category_Name}
                  </h3>
                  <div className="flex items-center text-primary font-semibold hover:underline">
                    Explore
                    <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
