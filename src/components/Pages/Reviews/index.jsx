import React, { useState, useEffect } from "react";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";
import { reviewAPI } from "../../../utils/apiService";
import ArtBlobLoader from "../../../common/Loader/ArtBlobLoader ";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await reviewAPI.getReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) return <ArtBlobLoader />;

  return (
    <div className="bg-soft py-10">
      <div className="mx-auto container">
        <h2 className="text-center text-4xl font-bold text-primary mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative bg-white backdrop-blur-xl rounded-3xl border border-primary/10 shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={rev.item_Image}
                alt={rev.customer_Name}
                className="w-20 h-20 rounded-full object-cover border-4 border-primary mb-4 shadow-md"
              />

              <FaQuoteLeft className="text-2xl text-primary opacity-30 absolute top-6 left-6" />

              <p className="text-primary text-lg mb-2">{rev.title}</p>
              <p className="text-gray-700 italic ">{rev.reviewText}</p>

              <FaQuoteRight className="text-2xl text-primary opacity-30 absolute bottom-6 right-6" />

              <div className="flex justify-center mt-4 mb-2">
                {[...Array(rev.rating)].map((_, j) => (
                  <FaStar key={j} className="text-yellow-500 text-lg" />
                ))}
              </div>

              <h4 className="font-bold text-xl text-primary">
                {rev.customer_Name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
