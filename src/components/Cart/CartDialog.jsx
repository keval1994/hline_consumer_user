import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { attributeAPI, cartAPI } from "../../utils/apiService";
import { FaMinus, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";
import { GiShoppingBag } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

const CartDialog = ({ isOpen, onClose }) => {
  const ref = useRef();
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem("customerId");
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [attributeMap, setAttributeMap] = useState({});

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCartItems();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await attributeAPI.getAllAttribute();
        const map = {};
        res.forEach((attr) => {
          map[attr.attribute_Id] = attr.attribute_Name;
        });
        setAttributeMap(map);
      } catch (error) {
        console.error("Failed to load attribute metadata", error);
      }
    };

    fetchAttributes();
  }, []);

  const parseAttributeXML = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const result = {};

    const attributes = xmlDoc.getElementsByTagName("Attribute");
    for (let attr of attributes) {
      const id = attr.getAttribute("ID");
      const valueNode = attr.getElementsByTagName("Value")[0];
      const value = valueNode ? valueNode.textContent : "";
      result[id] = value;
    }

    return result;
  };

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const res = await cartAPI.getCartListByCustomer(customerId);
      setCartItems(res.cartItems || []);
      setSummary(res.summary || {});
    } catch (err) {
      console.error("Failed to load cart dialog data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemRemove = async (cartId) => {
    try {
      setIsLoading(true);
      await cartAPI.removeCartByUser(cartId);
      const updated = cartItems.filter((item) => item.cart_Id !== cartId);
      setCartItems(updated);
    } catch (err) {
      console.error("Remove failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (cartId, newQty) => {
    if (newQty < 1) return;
    const updatedItems = cartItems.map((i) =>
      i.cart_Id === cartId
        ? { ...i, qty: newQty, total_Amount: i.price * newQty }
        : i
    );

    setCartItems(updatedItems);
    // const newSubtotal = updatedItems.reduce(
    //   (sum, i) => sum + i.total_Amount,
    //   0
    // );
    // setSummary((prev) => ({
    //   ...prev,
    //   subTotal: newSubtotal,
    //   original_Price: updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    //   total_Discount_Amount: updatedItems.reduce(
    //     (sum, i) => sum + (i.price * i.qty - i.total_Amount),
    //     0
    //   ),
    // }));
  };

  if (!isOpen || cartItems.length === 0) return null;

  if (isLoading) return <ArtBlobLoader />;

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
        <div className="bg-white w-[400px] h-full p-6 overflow-auto shadow-xl">
          <h2 className="text-lg font-bold text-center text-gray-600 mt-10">
            Your cart is empty.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end font-sans">
        <div
          ref={ref}
          className="bg-white w-[400px] h-full p-6 shadow-xl relative overflow-y-auto rounded-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <GiShoppingBag className="text-3xl text-primary" />
              Shopping Bag
            </h2>
            <button onClick={onClose} className="text-xl text-red">
              <IoMdClose className="font-bold" />
            </button>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.cart_Id}
              className="flex gap-4 border-b pb-6 mb-6 last:mb-0 last:border-b-0"
            >
              <div className="relative group">
                <img
                  src={item.item_Image}
                  alt={item.item_Name}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col flex-1">
                <p className="text-base font-semibold text-gray-800">
                  {item.item_Name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {item.qty} x ₹ {item.price}
                </p>
                {item.discount > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    {item.discount} % Off
                  </p>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium">Your Image:</span>{" "}
                    <button
                      onClick={() => {
                        setModalImage(item.image);
                        setShowModal(true);
                      }}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Attachment
                    </button>
                  </p>
                  <p>
                    <span className="font-medium">Reference Picture:</span>{" "}
                    <button
                      onClick={() => {
                        setModalImage(item.reference_Picture);
                        setShowModal(true);
                      }}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Attachment
                    </button>
                  </p>
                  <p>
                    {(() => {
                      const attrs = parseAttributeXML(item.attributeXML || "");
                      return Object.entries(attrs).map(([id, value]) => {
                        const label = attributeMap[id] || `Attribute ${id}`;
                        return (
                          <p key={id}>
                            <span className="font-medium">{label}:</span>{" "}
                            {value}
                          </p>
                        );
                      });
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                <div className="flex items-center justify-between border rounded-lg overflow-hidden shadow-sm bg-white w-fit">
                  <button
                    onClick={() => updateQuantity(item.cart_Id, item.qty - 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
                    aria-label="Decrease quantity"
                    disabled
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 text-sm font-medium text-gray-800">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cart_Id, item.qty + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
                    aria-label="Increase quantity"
                    disabled
                  >
                    <FaPlus />
                  </button>
                </div>

                <button
                  onClick={() => handleItemRemove(item.cart_Id)}
                  className="text-md text-red-500 hover:text-red-700"
                >
                  <MdDeleteForever />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 border-t pt-6 text-sm space-y-4">
            {summary && (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>₹ {summary.original_Price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span className="text-green">
                    - ₹ {summary.discount_Amount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Total Discount Amount</span>
                  <span>₹ {summary.total_Discount_Amount}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-gray-800 border-t pt-2">
                  <span>Sub Total</span>
                  <span>₹ {summary.subTotal}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
              className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-dark transition"
            >
              View Cart
            </button>
            <button className="w-full bg-[#c5aa87] text-white py-3 rounded-xl hover:bg-[#b89f72] transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <motion.div
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-2xl relative shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 px-5 py-4 bg-blue-100 border-b border-blue-200">
              <h3 className="text-base font-semibold text-blue-800">
                Attachment
              </h3>
            </div>
            <button
              className="absolute top-3 right-6 text-gray-600 hover:text-black text-2xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt="Attachment"
              className="w-full max-h-[80vh] object-contain rounded p-4"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default CartDialog;
