import { useLocation, useNavigate } from "react-router-dom";
import { cartAPI } from "../../utils/apiService";
import { useState } from "react";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";
import { notify } from "../../common/Toast";

const ConfirmOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderInfo, cartItems, summary } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);

  if (!orderInfo) {
    return <div>No order found. Please go back to checkout.</div>;
  }

  const handlePayNow = async () => {
    try {
      setIsLoading(true);
      const cartId = summary?.cart_Id || cartItems[0]?.cart_Id;
      const finalOrder = await cartAPI.finalOrderByCartId(cartId);
      notify("Order placed successfully!", "success");
      navigate("/orderSuccess", { state: { finalOrder } });
    } catch (err) {
      console.error("Final order error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <ArtBlobLoader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Order Confirmed</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <p>
          {orderInfo.shipping_Addline1}, {orderInfo.shipping_Addline2}
        </p>
        <p>{orderInfo.shipping_City}</p>
        <p>State ID: {orderInfo.shipping_State_Id}</p>
        <p>Country ID: {orderInfo.shipping_Country_Id}</p>
        <p>Pin: {orderInfo.shipping_Pincode}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        {cartItems?.map((item) => (
          <div key={item.cart_Id} className="mb-2">
            <p>
              {item.item_Name} - ₹{item.price} × {item.quantity}
            </p>
          </div>
        ))}
        <p>
          <strong>SubTotal:</strong> ₹{summary?.subTotal}
        </p>
        <p>
          <strong>Discount:</strong> ₹{summary?.discountAmount}
        </p>
        <p>
          <strong>Tax:</strong> ₹{summary?.totalTax}
        </p>
        <p>
          <strong>Total:</strong> ₹{summary?.total}
        </p>
      </div>

      <button
        onClick={handlePayNow}
        className="bg-accent hover:bg-primary text-white py-2 px-6 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default ConfirmOrder;
