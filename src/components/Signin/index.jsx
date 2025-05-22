import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { cartAPI, loginCustomer, wishListAPI } from "../../utils/apiService";
import { Illustration } from "../../utils";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    EmailId: "",
    Password: "",
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/signin");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginCustomer(formData);
      sessionStorage.setItem("user", JSON.stringify(data));
      sessionStorage.setItem("customerId", data.customerId);

      const intendedAction = location.state?.intendedAction;

      if (intendedAction) {
        const { type, item } = intendedAction;

        if (type === "add_to_wishlist") {
          await wishListAPI.addToWishlist({
            customerId: data.customerId,
            itemId: item.item_Id,
            price: item.discount_Price || item.price || 0,
            discount: item.discount || 0,
            image: item.item_Image,
          });
          navigate("/wishlist");
          return;
        }

        if (type === "add_to_cart") {
          const payload = {
            customer_Id: data.customerId,
            item_Id: item.item_Id,
            price: item.discount_Price || item.price || 0,
            qty: 1,
            total_Amount: item.discount_Price || item.price || 0,
            created_By: 1,
          };

          await cartAPI.addToCart(payload);
          navigate("/cart");
          return;
        }

        if (type === "view_product") {
          navigate(`/productdetails/${item.item_Id}`);
          return;
        }
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <ArtBlobLoader />;
  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8 ">
      <div className="flex w-full max-w-5xl bg-soft rounded-xl shadow-lg overflow-hidden p-6">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-white rounded-xl">
          <img
            src={Illustration}
            alt="Shopping illustration"
            className="w-full max-w-xs object-contain "
          />
        </div>

        <div className="w-full md:w-1/2 bg-soft p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="text-gray-400 mr-2">
                  <HiOutlineMail />
                </span>
                <input
                  type="email"
                  name="EmailId"
                  value={formData.EmailId}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="text-gray-400 mr-2">
                  <HiOutlineLockClosed />
                </span>
                <input
                  type="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-3 py-2 bg-primary hover:bg-accent text-white font-semibold rounded-lg shadow transition"
            >
              Sign In
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-medium hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
