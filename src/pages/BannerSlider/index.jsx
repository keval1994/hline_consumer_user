import { useEffect, useState } from "react";
import Slider from "react-slick";
import { bannerAPI } from "../../utils/apiService";
import { motion } from "framer-motion";

const BannerSlider = () => {
  const [IsBannerData, setIsBannerData] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerAPI.getAll();
        setIsBannerData(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: false,
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Slider {...settings}>
        {IsBannerData.map((banner, index) => (
          <div key={index}>
            <div className="relative h-[80vh] md:h-[600px] w-full overflow-hidden">
              <img
                src={banner.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover animate-kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="absolute bottom-10 left-10 text-white max-w-xl"
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  {banner.title || "Artistic Expression"}
                </h2>
                <p className="text-lg md:text-xl font-light drop-shadow">
                  {banner.description ||
                    "Explore exclusive collections by top artists."}
                </p>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
