import { useEffect, useState } from "react";
import { IoLeaf } from "react-icons/io5";
import { SiMedibangpaint } from "react-icons/si";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaPaintBrush } from "react-icons/fa";
import BannerSlider from "./BannerSlider";
import DiscountProducts from "./DiscountProducts";
import ExploreArt from "./ExploreArt";
import SubCategorySlider from "./SubCategorySlider";
import Category from "./Category";
import { exploreArtAPI, reviewAPI } from "../utils/apiService";
import ArtBlobLoader from "../common/Loader/ArtBlobLoader ";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [exploreItems, setExploreItems] = useState([]);
  const [reviewsItems, setReviewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    if (reviewsItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviewsItems.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [reviewsItems]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [reviews, explore] = await Promise.all([
        reviewAPI.getReviews(),
        exploreArtAPI.getAllExploreArtData(customerId || 0),
      ]);
      setReviewsItems(reviews);
      setExploreItems(explore.slice(0, 6));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fadeIn = (
    direction = "up",
    type = "spring",
    delay = 0,
    duration = 0.75
  ) => ({
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { type, delay, duration, ease: "easeOut" },
    },
  });

  const layoutMap = [
    "col-span-2 row-span-1",
    "col-start-3 row-span-3",
    "col-start-1 row-start-2 row-span-2",
    "col-start-2 row-start-2",
    "col-start-2 row-start-3",
    "col-start-2 col-span-2 row-start-4",
  ];

  const getTransform = (offset) => {
    const absOffset = Math.abs(offset);
    return {
      scale: 1 - absOffset * 0.1,
      translateX: `${offset * 220}px`,
      zIndex: 10 - absOffset,
      opacity: absOffset > 2 ? 0 : 1,
      rotate: offset * 2,
    };
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? reviewsItems.length - 1 : prev - 1
    );
  };

  if (isLoading) return <ArtBlobLoader />;

  return (
    <div className="w-full overflow-hidden text-primary relative bg-soft">
      <BannerSlider />
      <SubCategorySlider />
      <div className="container">
        <Category />
        <DiscountProducts />
        <ExploreArt />

        <motion.div
          className="relative text-center my-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-monospace text-4xl font-extrabold text-accent">
            Preserve The Past, Embrace The Future
          </h2>
          <div className="flex items-center justify-center mt-4">
            <div className="w-20 h-px bg-gray-300"></div>
            <SiMedibangpaint className="text-3xl text-gray-600 mx-4 animate-spin-slow" />
            <div className="w-20 h-px bg-gray-300"></div>
          </div>
        </motion.div>

        <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 md:px-10">
          <motion.div
            className="md:w-5/12 w-full text-center md:text-left"
            variants={fadeIn("left", "spring", 0, 1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="font-monospace text-4xl font-bold text-indigo-800 mb-4">
              Artworks & Paintings
            </p>
            <p className="text-lg text-gray-700">
              Our Latest Collection Of Original Lorem Ipsum. Lorem ipsum dolor,
              sit amet consectetur adipisicing elit.
            </p>
          </motion.div>

          <motion.div
            className="md:w-7/12 w-full grid grid-cols-3 grid-rows-4 gap-3 h-[650px] relative group"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            {exploreItems.map((item, index) => (
              <motion.div
                key={item.item_Id}
                className={`relative rounded-xl overflow-hidden shadow-md cursor-pointer ${layoutMap[index]}`}
                variants={fadeIn("up", "tween", index * 0.2, 0.6)}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/productdetails/${item.item_Id}`)}
              >
                <img
                  src={item.item_Image}
                  alt={item.item_Name}
                  className="w-full h-full object-cover transition duration-300 hover:opacity-40"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="relative left-1/2 -translate-x-1/2 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center mb-12">
            <h2 className="font-semibold text-4xl text-[#081F62] tracking-wide">
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-[2px] bg-[#081F62] w-20 rounded" />
              <FaPaintBrush className="text-[#081F62] w-6 h-6 animate-pulse" />
              <div className="h-[2px] bg-[#081F62] w-20 rounded" />
            </div>
          </div>

          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="w-12 h-12 ml-20 bg-[#081F62] text-white rounded-full shadow-md flex items-center justify-center hover:scale-110 hover:bg-[#0A2A89] transition"
            >
              <FaChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="w-12 h-12 mr-20 bg-[#081F62] text-white rounded-full shadow-md flex items-center justify-center hover:scale-110 hover:bg-[#0A2A89] transition"
            >
              <FaChevronRight size={24} />
            </button>
          </div>

          <div className="relative h-[480px] flex items-center justify-center px-4 overflow-hidden">
            {[...Array(5)].map((_, i) => {
              const offset = i - 2;
              const index =
                (currentIndex + offset + reviewsItems.length) %
                reviewsItems.length;
              const item = reviewsItems[index];
              const transform = getTransform(offset);

              return item ? (
                <motion.div
                  key={index}
                  className="absolute w-[300px] h-[400px] p-4 bg-white border-2 border-[#081F62] rounded-xl flex flex-col justify-between text-center shadow-lg cursor-pointer transition-all duration-700 group"
                  style={{
                    transform: `translateX(${transform.translateX}) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
                    zIndex: transform.zIndex,
                    opacity: transform.opacity,
                  }}
                >
                  <motion.img
                    src={item.item_Image || "Review Image"}
                    alt={item.customer_Name}
                    className="w-full h-[200px] object-cover rounded-md"
                  />

                  <div className="p-2 relative group">
                    <h3 className="font-bold uppercase text-[#081F62] text-xl mb-2">
                      {item.customer_Name}
                    </h3>
                    <p className="text-yellow-500 font-bold text-lg">
                      ⭐ {item.rating} / 5
                    </p>
                    <p className="text-gray-600 mt-2 text-sm italic">
                      "{item.reviewText}"
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div
                  key={`empty-${i}`}
                  className="absolute w-[300px] h-[400px] border-dashed border-2 border-[#cfd4e0] bg-white rounded-xl flex items-center justify-center text-[#a0a7ba] text-xl"
                  style={{
                    transform: `translateX(${transform.translateX}) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
                    zIndex: transform.zIndex,
                    opacity: transform.opacity,
                  }}
                >
                  No Review
                </div>
              );
            })}
          </div>
        </div>

        <section className="relative pb-8 overflow-hidden">
          <div>
            <svg
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full z-0"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 Q250,100 500,50 T1000,50"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="10 10"
              />
            </svg>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mt-10">
                Why choose us?
              </h2>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="w-20 h-px bg-gray-300"></div>
              <IoLeaf className="text-3xl text-gray-600 mx-4 animate-spin-slow" />
              <div className="w-20 h-px bg-gray-300"></div>
            </div>
          </div>
          <div>
            <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-8 px-6 md:px-20">
              {[
                {
                  icon: "🚚",
                  title: "Fast & Free Shipping",
                  desc: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
                  active: false,
                },
                {
                  icon: "🛡️",
                  title: "Warranty Protection",
                  desc: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint velit.",
                  active: true,
                },
                {
                  icon: "🏅",
                  title: "Premium protection",
                  desc: "Amet minim mollit non deserunt ullamco est sit aliqua.",
                  active: false,
                },
              ].map((item, i) => (
                <>
                  <div
                    key={i}
                    className={`w-full md:w-[310px] text-center rounded-xl shadow-lg px-6 py-8 transition-all duration-300 transform group ${
                      item.active
                        ? "bg-secondary text-white hover:bg-white hover:text-black cursor-pointer border-2 scale-110 z-20 hover:scale-105"
                        : "bg-white text-black hover:bg-secondary hover:text-white cursor-pointer border-2 hover:scale-105"
                    }`}
                    style={{ marginTop: item.active ? "10%" : "0" }}
                  >
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h4
                      className={`font-bold font-cinzel text-lg mb-2 tracking-wide `}
                    >
                      {item.title}
                    </h4>
                    <p className={`text-sm tracking-wider`}>{item.desc}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
