import { useEffect, useState } from "react";
import Slider from "react-slick";
import { allItemsAPI } from "../../utils/apiService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CartDialog from "../../components/Cart/CartDialog";
import ItemCard from "../../common/ItemCard";
import { SiMedibangpaint } from "react-icons/si";
import { motion } from "framer-motion";

const SampleNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute z-10 -right-0 top-0 transform -translate-y-1/2 bg-primary text-white rounded-full p-2 cursor-pointer shadow hover:bg-accent"
  >
    <FaChevronRight />
  </div>
);

const SamplePrevArrow = ({ onClick }) => (
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
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 1 },
    },
  ],
};

const DiscountProducts = () => {
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [IsDiscountProducts, setIsDiscountProducts] = useState([]);
  const [subTotal, setSubTotal] = useState([]);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        const data = await allItemsAPI.getDiscountItems(customerId || 0);
        if (data && data.data) {
          setIsDiscountProducts(data.data);
        } else {
          setIsDiscountProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch Discount Products:", error);
      }
    };

    fetchDiscountProducts();
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
              Preserve The Past, Embrace The Future
            </h2>
            <div className="flex items-center justify-center mt-4">
              <div className="w-20 h-px bg-gray-300"></div>
              <SiMedibangpaint className="text-3xl text-gray-600 mx-4 animate-spin-slow" />
              <div className="w-20 h-px bg-gray-300"></div>
            </div>
          </motion.div>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-4 relative">
              <Slider {...sliderSettings}>
                {IsDiscountProducts.map((item) => (
                  <div key={item.item_Id} className="cursor-pointer">
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
        item={selectedItem}
        subTotal={subTotal}
      />
    </>
  );
};

export default DiscountProducts;
