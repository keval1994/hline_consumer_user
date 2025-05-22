import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI, countryAPI, stateAPI } from "../../utils/apiService";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";

const InputField = ({
  label,
  type = "text",
  name,
  className = "",
  value,
  onChange,
}) => (
  <div className={`mb-5 ${className}`}>
    <label
      htmlFor={name}
      className="block mb-1 text-sm text-primary font-medium"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      className="w-full px-4 py-2.5 text-sm text-primary bg-muted border border-soft rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition"
      placeholder=""
      autoComplete="off"
      value={value}
      onChange={onChange}
    />
  </div>
);

const SelectField = ({
  label,
  name,
  options = [],
  value,
  onChange,
  className = "",
}) => (
  <div className={`mb-5 ${className}`}>
    <label
      htmlFor={name}
      className="block mb-1 text-sm text-primary font-medium"
    >
      {label}
    </label>
    <select
      name={name}
      id={name}
      className="w-full px-4 py-2.5 text-sm text-primary bg-muted border border-soft rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition"
      value={value}
      onChange={onChange}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ label, name, onChange }) => (
  <div className="mb-5 flex items-center gap-3">
    <input
      type="checkbox"
      name={name}
      id={name}
      className="h-5 w-5 text-accent border-soft rounded focus:ring-accent transition-all duration-300"
      onChange={onChange}
    />
    <label
      htmlFor={name}
      className="text-sm text-secondary cursor-pointer select-none"
    >
      {label}
    </label>
  </div>
);

const CheckOut = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [billingData, setBillingData] = useState({});
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const customerId = sessionStorage.getItem("customerId");
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [countryData, stateData] = await Promise.all([
        countryAPI.getAll(),
        stateAPI.getAll(),
      ]);

      const mappedCountries = countryData.map((c) => ({
        value: c.id,
        label: c.name,
      }));

      const mappedStates = stateData.map((s) => ({
        value: s.state_Id,
        label: s.state_Name,
      }));

      setCountries(mappedCountries);
      setStates(mappedStates);
    } catch (err) {
      console.error("Error fetching countries or states:", err);
    }
  };

  useEffect(() => {
    if (!customerId) {
      navigate("/signin");
      return;
    }

    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        const data = await cartAPI.getCartListByCustomer(customerId);
        setCartItems(data.cartItems || []);
        setSummary(data.summary || {});
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleSameAsBillingChange = async (e) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);

    if (checked) {
      try {
        setIsLoading(true);
        const res = await cartAPI.getBillingAddress(customerId);
        const mappedData = {
          address1: res.billing_AddLine1 || "",
          address2: res.billing_AddLine2 || "",
          billingCity: res.billing_City || "",
          billingStateID: res.billing_State_Id || "",
          billingCountryID: res.billing_Country_Id || "",
          billingPincode: res.billing_Pincode || "",
        };

        setBillingData(mappedData);
      } catch (error) {
        console.error("Failed to fetch billing address", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setBillingData({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = {
        Cart_Id: summary?.cart_Id || cartItems[0]?.cart_Id,
        Shipping_Addline1: billingData?.address1 || "",
        Shipping_Addline2: billingData?.address2 || "",
        Shipping_City: billingData?.billingCity || "",
        Shipping_State_Id: billingData?.billingStateID || 0,
        Shipping_Country_Id: billingData?.billingCountryID || 0,
        Shipping_Pincode: billingData?.billingPincode || "",
      };

      const response = await cartAPI.confirmOrder(orderData);
      navigate("/confirmOrder", {
        state: {
          orderInfo: response,
          cartItems,
          summary,
        },
      });
    } catch (error) {
      console.error("Order confirmation failed:", error);
      alert("Failed to confirm order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <ArtBlobLoader />;

  return (
    <>
      <div className="min-h-screen font-sans flex items-center justify-center px-2 md:px-6 overflow-auto md:overflow-hidden p-12">
        <div className="w-full max-w-6xl h-full flex flex-col md:flex-row overflow-hidden">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-2/3 p-6 md:p-10 overflow-visible md:overflow-y-auto max-h-full md:max-h-screen bg-base"
          >
            <motion.h2
              className="text-xl font-semibold text-primary mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Contact
            </motion.h2>

            <InputField
              type="email"
              name="email"
              label="Email or mobile number"
            />
            <CheckboxField
              name="newsletter"
              label="Email me with news and offers"
            />

            <CheckboxField
              name="sameAsBilling"
              label="Same as Billing Address"
              onChange={handleSameAsBillingChange}
            />

            <h2 className="text-xl font-semibold text-primary mb-4">
              Delivery
            </h2>

            <div className="flex gap-4">
              <InputField
                name="firstName"
                label="First name"
                className="flex-1"
                value={billingData?.firstName || ""}
                readOnly={sameAsBilling}
              />
              <InputField
                name="lastName"
                label="Last name"
                className="flex-1"
                value={billingData?.lastName || ""}
                readOnly={sameAsBilling}
              />
            </div>

            <div className="flex gap-4">
              <InputField
                name="address1"
                label="Address Line 1"
                className="flex-1"
                value={billingData?.address1 || ""}
                onChange={handleInputChange}
                readOnly={sameAsBilling}
              />
              <InputField
                name="address2"
                label="Address Line 2"
                className="flex-1"
                value={billingData?.address2 || ""}
                onChange={handleInputChange}
                readOnly={sameAsBilling}
              />
            </div>

            <InputField
              name="billingCity"
              label="City"
              value={billingData?.billingCity || ""}
              onChange={handleInputChange}
              readOnly={sameAsBilling}
            />

            <div className="flex gap-4">
              <SelectField
                name="billingCountryID"
                label="Country"
                options={countries}
                value={billingData.billingCountryID || ""}
                onChange={handleInputChange}
                className="flex-1"
                disabled={sameAsBilling}
              />

              <SelectField
                name="billingStateID"
                label="State"
                options={states}
                value={billingData.billingStateID || ""}
                onChange={handleInputChange}
                className="flex-1"
                disabled={sameAsBilling}
              />
            </div>

            <div className="flex gap-4">
              <InputField
                name="pinCode"
                label="Pin code"
                className="flex-1"
                value={billingData?.billingPincode || ""}
                onChange={handleInputChange}
                readOnly={sameAsBilling}
              />
            </div>

            <CheckboxField
              name="saveInfo"
              label="Save this information for next time"
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-accent text-base py-3 mt-5 rounded font-semibold text-white hover:bg-primary transition"
              onClick={handleConfirmOrder}
            >
              Confirm Order
            </motion.button>

            <p className="text-xs text-secondary mt-8">
              All rights reserved dt-multi-art
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/3 bg-white bg-opacity-30 backdrop-blur-md overflow-y-auto p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-primary mb-4">
              Your Order Details
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-sm text-secondary">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.cart_Id}
                  className="flex gap-3 border-b pb-3 relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="relative w-20 h-20">
                    <img
                      src={item.item_Image}
                      alt={item.item_Name}
                      className="w-full h-full object-cover rounded shadow"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-primary">
                      {item.item_Name || "Product"}
                    </p>
                    <p className="text-secondary">
                      {item.Attributes?.filter((attr) =>
                        [
                          "Custom Text",
                          "Custom Color",
                          "Custom Details",
                        ].includes(attr.Name)
                      ).map((attr) => (
                        <p key={attr.AttributeId} className="text-secondary">
                          {attr.Name}: {attr.Value || "None"}
                        </p>
                      ))}
                    </p>
                    <p className="text-secondary">
                      ₹{item.price} × {item.qty || 1}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Reference Picture:</strong>{" "}
                      <button
                        onClick={() => {
                          setModalImage(item.reference_Picture);
                          setShowModal(true);
                        }}
                        className="text-blue-500 underline"
                      >
                        View
                      </button>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Your Image:</strong>
                      <button
                        onClick={() => {
                          setModalImage(item.image);
                          setShowModal(true);
                        }}
                        className="text-blue-500 underline"
                      >
                        View
                      </button>
                    </p>
                  </div>
                </motion.div>
              ))
            )}

            <div className="flex justify-between mb-2">
              <span>Original Price:</span>
              <span className="font-medium">
                ₹{summary?.original_Price?.toFixed(0)}
              </span>
            </div>

            {summary && (
              <>
                <div className="flex justify-between mb-2">
                  <span>Avg. Discount:</span>
                  <span className="font-medium text-green-600">
                    ₹ {summary.discount_Amount}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Discount:</span>
                  <span className="font-medium">
                    - ₹ {summary?.total_Discount_Amount?.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Final Price:</span>
                  <span className="font-semibold text-xl">
                    ₹ {summary?.subTotal?.toFixed(0)}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      {showModal && (
        <motion.div
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-2xl relative shadow-xl"
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

export default CheckOut;
