import { useEffect, useState } from "react";
import Slider from "react-slick";
import { exploreArtAPI } from "../../utils/apiService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CartDialog from "../../components/Cart/CartDialog";
import ItemCard from "../../common/ItemCard";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";
import { MdOutlineExplore } from "react-icons/md";
import { motion } from "framer-motion";

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute z-10 -right-0 top-0 transform -translate-y-1/2 bg-primary text-white rounded-full p-2 cursor-pointer shadow hover:bg-accent"
  >
    <FaChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute z-10 right-10 top-0 transform -translate-y-1/2 bg-primary text-white rounded-full p-2 cursor-pointer shadow hover:bg-accent"
  >
    <FaChevronLeft />
  </div>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

const ExploreArt = () => {
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [IsExploreArtData, setISExploreData] = useState([]);
  const [subTotal, setSubTotal] = useState([]);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const data = await exploreArtAPI.getAllExploreArtData(customerId);
        setISExploreData(data);
      } catch (error) {
        console.error("Failed to fetch Explore Art Data:", error);
      }
    };

    fetchExploreData();
  }, []);

  return (
    <>
      <section className="px-4">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative text-center my-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-monospace text-4xl font-extrabold text-accent">
              Explore Featured Collections{" "}
            </h2>
            <div className="flex items-center justify-center mt-4">
              <div className="w-20 h-px bg-gray-300"></div>
              <MdOutlineExplore className="text-3xl text-gray-600 mx-4 animate-spin-slow" />
              <div className="w-20 h-px bg-gray-300"></div>
            </div>
          </motion.div>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-4 relative">
              <Slider {...sliderSettings}>
                {IsExploreArtData.map((item) => (
                  <div key={item.item_Id}>
                    <ItemCard
                      item={item}
                      setSelectedItem={setSelectedItem}
                      setShowCartDialog={setShowCartDialog}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </section>
        </div>
      </section>
      <CartDialog
        isOpen={showCartDialog}
        onClose={() => setShowCartDialog(false)}
        cartItem={selectedItem}
        subTotal={subTotal}
      />
    </>
  );
};

export default ExploreArt;
