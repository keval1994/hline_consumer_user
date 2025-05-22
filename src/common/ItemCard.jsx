import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { PiTrolleySuitcaseBold } from "react-icons/pi";
import WishlistIcon from "../components/WishList/WishlistIcon";
import { cartAPI } from "../utils/apiService";
import { useState } from "react";
import ArtBlobLoader from "./Loader/ArtBlobLoader ";

const ItemCard = ({ item, setSelectedItem, setShowCartDialog, gridView }) => {
  const navigate = useNavigate();
  const [subTotal, setSubTotal] = useState([]);
  const customerId = sessionStorage.getItem("customerId");
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = () => {
    navigate(`/productdetails/${item.item_Id}`);
  };

  const handleAddToCart = async (item) => {
    if (!customerId) {
      navigate("/signin");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("Customer_Id", customerId);
      formData.append("Item_Id", item.item_Id);

      const price = item.discount_Price || item.price || 0;
      const qty = 1;
      const total = price * qty;

      formData.append("Price", price);
      formData.append("Qty", qty);
      formData.append("Total_Amount", total);
      formData.append("Created_By", 1);
      formData.append("Modified_By", 1);
      formData.append("Discount", item.discount || 0);
      formData.append("Net_Amount", total);

      const dummyFile = new File([""], "dummy.png");
      formData.append("Image", dummyFile);
      formData.append("Reference_Picture", dummyFile);
      formData.append("Attributes[0].AttributeId", 2);
      formData.append("Attributes[0].Value", "Red");
      formData.append("Attributes[1].AttributeId", 9);
      formData.append("Attributes[1].Value", "12");

      await cartAPI.addToCart(formData);
      const updatedCart = await cartAPI.getCartListByCustomer(customerId);

      setSelectedItem(item);
      setSubTotal(updatedCart?.subTotal || 0);
      setShowCartDialog(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <ArtBlobLoader />;

  return (
    <>
      <div className="container mx-auto px-2 py-4 ">
        {gridView === "list" ? (
          <div className="flex bg-white rounded-xl shadow p-4 items-center hover:shadow-lg transition-all gap-6">
            <div className="w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg border">
              <img
                src={item.item_Image}
                alt={item.item_Name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              {item.discount > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                  {item.discount} % Off
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-800">
                {item.item_Name}
              </h3>
              <div className="text-left mb-4">
                <p className="text-green-600 font-bold">
                  ₹{item.discount_Price ?? item.old_Price}
                </p>
                {item.discount > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    ₹{item.old_Price}
                  </p>
                )}
              </div>

              <div
                className="text-sm mb-3"
                dangerouslySetInnerHTML={{ __html: item.item_Desc || "" }}
              ></div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleViewDetails}
                  title="View"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary text-primary hover:bg-accent hover:text-white shadow transition-all duration-300"
                >
                  <IoEyeSharp size={18} />
                </button>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white shadow transition-all duration-300">
                  <WishlistIcon item={item} />
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  title="Add to Cart"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary text-primary hover:bg-accent hover:text-white shadow transition-all duration-300"
                >
                  <PiTrolleySuitcaseBold size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="group relative border w-full mx-auto scale-95 hover:scale-100 transition-transform duration-300 bg-white shadow rounded-lg">
            <div className="group flip-card w-full h-[320px] relative ">
              <div className="flip-card-inner rounded-lg shadow border border-gray-200 w-full h-full relative">
                <div className="flip-card-front relative w-full h-full ">
                  <img
                    src={item.item_Image}
                    alt={item.item_Name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grid sm:grid-cols-1"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
                    <h4 className="font-sans text-white font-bold text-xl px-2 tracking-wide">
                      {item.item_Name}
                    </h4>
                  </div>
                </div>
                <div className="flip-card-back bg-[#ffffffcc] backdrop-blur-sm flex flex-col justify-between h-full p-4 rounded-lg text-primary relative group">
                  <div>
                    <div
                      className="text-sm mb-3"
                      dangerouslySetInnerHTML={{ __html: item.item_Desc || "" }}
                    ></div>

                    {item.discount > 0 && (
                      <span className="inline-block mb-3 bg-green text-white text-xs px-2 py-1 rounded">
                        {item.discount} % OFF
                      </span>
                    )}
                  </div>
                  <div className="text-left mb-4">
                    {item.discount ? (
                      <>
                        <p className="text-green-600 font-bold">
                          ₹{item.discount_Price}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {item.discount > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{item.old_Price}
                            </p>
                          )}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">₹{item.old_Price}</p>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      onClick={handleViewDetails}
                      title="View"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-accent text-accent hover:bg-primary hover:text-white shadow transition-all duration-300"
                    >
                      <IoEyeSharp size={18} />
                    </button>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-accent text-accent hover:bg-primary hover:text-white shadow transition-all duration-300">
                      <WishlistIcon item={item} />
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      title="Add to Cart"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-accent text-accent hover:bg-accent hover:text-white shadow transition-all duration-300"
                    >
                      <PiTrolleySuitcaseBold size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemCard;
