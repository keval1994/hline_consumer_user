import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { attributeAPI, cartAPI } from "../../utils/apiService";
import { motion } from "framer-motion";
import { GiShoppingCart } from "react-icons/gi";
import { TfiClose } from "react-icons/tfi";
import Breadcrumb from "../../common/Breadcrumb";
import { MdDeleteForever } from "react-icons/md";
import { notify } from "../../common/Toast";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attributeMap, setAttributeMap] = useState({});
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await attributeAPI.getAllAttribute();
        const map = {};
        res.forEach((attr) => {
          map[attr.attribute_Id] = attr.attribute_Name;
        });
        setAttributeMap(map);
      } catch (e) {
        console.error("Failed to load attributes", e);
      }
    };
    fetchAttributes();
  }, []);

  useEffect(() => {
    const customerId = sessionStorage.getItem("customerId");
    if (!customerId) {
      navigate("/signin");
      return;
    }
    const fetchCartData = async () => {
      try {
        const data = await cartAPI.getCartListByCustomer(customerId);
        setCartItems(data.cartItems || []);
        setSummary(data.summary || {});
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCartData();
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

  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;

    const item = cartItems.find((i) => i.cart_Id === cartId);
    if (!item) return;

    try {
      const payload = {
        Cart_Id: item.cart_Id,
        Item_Id: item.item_Id,
        Customer_Id: item.customer_Id,
        Qty: newQty,
      };

      await cartAPI.updateItemQty(payload);

      const updatedItems = cartItems.map((i) => {
        if (i.cart_Id === cartId) {
          const originalTotal = i.price * newQty;
          const discountAmount = i.discount
            ? (originalTotal * i.discount) / 100
            : 0;
          const finalTotal = originalTotal - discountAmount;

          return {
            ...i,
            qty: newQty,
            total_Amount: finalTotal,
          };
        }
        return i;
      });

      setCartItems(updatedItems);

      const originalTotal = updatedItems.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      );
      const totalDiscount = updatedItems.reduce((sum, i) => {
        const discountAmount = i.discount
          ? (i.price * i.qty * i.discount) / 100
          : 0;
        return sum + discountAmount;
      }, 0);

      setSummary({
        original_Price: originalTotal,
        total_Discount_Amount: totalDiscount,
        discount_Amount: totalDiscount,
        subTotal: originalTotal - totalDiscount,
      });
      notify("Cart updated", "success");
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleDelete = async (cartId) => {
    try {
      await cartAPI.removeCartByUser(cartId);
      const updated = cartItems.filter((item) => item.cart_Id !== cartId);
      setCartItems(updated);
      const newSubtotal = updated.reduce((sum, i) => sum + i.total_Amount, 0);
      setSummary((prev) => ({ ...prev, subTotal: newSubtotal }));
      notify("Item removed from cart", "error");
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };
  const handleCheckOut = () => navigate("/checkOut");

  return (
    <div className="bg-soft min-h-screen py-10 px-4 lg:px-20 font-sans">
      <div className="container mx-auto">
        <Breadcrumb pageName="Your Cart" />
        {cartItems.length === 0 ? (
          <div className="text-center mt-20 flex flex-col items-center">
            <GiShoppingCart className="text-8xl text-gray-400 mb-4" />
            <p className="text-lg text-secondary mb-6 capitalize tracking-wider">
              Now, No items in your cart
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cart_Id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <img
                    src={item.item_Image}
                    alt="cart item"
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <div className="flex-1 space-y-1 text-sm">
                    <h4 className="text-lg font-bold text-primary">
                      {item.Name}
                    </h4>
                    <p>
                      <strong>Your Image :</strong>{" "}
                      <button
                        onClick={() => {
                          setModalImage(item.image);
                          setShowModal(true);
                        }}
                        className="text-blue-500 underline gap-3"
                      >
                        Attachment
                      </button>
                    </p>
                    <p>
                      <strong>Reference :</strong>{" "}
                      <button
                        onClick={() => {
                          setModalImage(item.reference_Picture);
                          setShowModal(true);
                        }}
                        className="text-blue-500 underline gap-3"
                      >
                        Attachment
                      </button>
                    </p>
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

                    <p>
                      <strong>Text:</strong> {item.custom_Text}
                    </p>
                    <p>
                      <strong>Color:</strong> {item.custom_Color}
                    </p>
                    <p>
                      <strong>Details:</strong> {item.custom_Details}
                    </p>
                  </div>
                  <div className=" text-right space-y-2">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(item.cart_Id)}
                        className="text-red  text-lg"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                    <p className="font-bold text-lg text-primary">
                      ₹{item.price}
                    </p>
                    {item.discount > 0 && (
                      <p className="font-bold text-lg text-primary">
                        {item.discount} %
                      </p>
                    )}
                    <div className="flex justify-end">
                      <div className="flex items-center border bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.cart_Id, item.qty - 1)
                          }
                          className="w-8 h-8 text-lg flex items-center justify-center text-primary hover:bg-gray-100 transition"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) updateQuantity(item.cart_Id, val);
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (!val || val < 1)
                              updateQuantity(item.cart_Id, 1);
                          }}
                          className="w-12 text-center py-1 border-x border-gray-200 focus:outline-none text-primary font-medium no-spinner"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.cart_Id, item.qty + 1)
                          }
                          className="w-12 text-center py-1 border-x border-gray-200 focus:outline-none text-primary font-medium no-spinner"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full sm:w-[320px] lg:w-[320px] xl:w-[400px] h-fit bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Cart Total
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span className="font-medium text-gray-900">
                    ₹ {summary?.original_Price?.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Discount:</span>
                  <span className="text-green font-medium">
                    - ₹ {summary?.discount_Amount?.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Discount:</span>
                  <span className="text-red-500 font-medium">
                    ₹ {summary?.total_Discount_Amount?.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-primary text-base">
                  <span>Final Price:</span>
                  <span>₹ {summary?.subTotal?.toFixed(0)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckOut}
                className="mt-6 w-full bg-accent text-white py-2 rounded-lg hover:bg-opacity-90"
              >
                Checkout
              </button>
              <div className="mt-4 text-center">
                <Link
                  to="/allProducts"
                  className="text-accent text-sm hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Modal */}
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-2xl relative shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="flex items-center gap-2 px-5 py-4 bg-blue-100 border-b border-blue-200">
                <h3 className="text-base font-semibold text-blue-800">
                  Attachment
                </h3>
                <button
                  className="absolute top-4 right-6 text-gray-600 hover:text-black text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  <TfiClose />
                </button>
              </div>
              <img
                src={modalImage}
                alt="Attachment"
                className="w-full max-h-[80vh] object-contain rounded p-4"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default Cart;
