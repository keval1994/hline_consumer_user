import { useNavigate, useLocation } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { wishListAPI } from "../../utils/apiService";
import { useEffect, useState } from "react";

const WishlistIcon = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = sessionStorage.getItem("customerId");
  const [isWished, setIsWished] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  useEffect(() => {
    const wishlistRaw = sessionStorage.getItem("wishlist");
    try {
      const wishlist = JSON.parse(wishlistRaw) || [];
      const existing = wishlist.find((w) => w.itemId === item.item_Id);
      if (existing) {
        setIsWished(true);
        setWishlistId(existing.wishlistId);
      }
    } catch (e) {
      console.warn("Invalid wishlist session data. Clearing.");
      sessionStorage.removeItem("wishlist");
    }
  }, [item.item_Id]);

  const handleClick = async () => {
    if (!customerId) {
      return navigate("/signup", {
        state: {
          from: location.pathname,
          intendedAction: {
            type: "add_to_wishlist",
            item,
          },
        },
      });
    }

    const wishlist = JSON.parse(sessionStorage.getItem("wishlist")) || [];

    try {
      if (isWished) {
        if (wishlistId) {
          await wishListAPI.removeWishlistByUser(wishlistId);
          setIsWished(false);
          setWishlistId(null);
          const updated = wishlist.filter((w) => w.itemId !== item.item_Id);
          sessionStorage.setItem("wishlist", JSON.stringify(updated));
        } else {
          console.warn("Missing wishlistId, cannot remove item:", item.item_Id);
        }
      } else {
        const payload = {
          Customer_Id: parseInt(customerId),
          Item_Id: item.item_Id,
        };
        const response = await wishListAPI.addToWishlist(payload);
        const newWishlistId = response?.wishlist_Id;

        setIsWished(true);
        setWishlistId(newWishlistId);
        wishlist.push({ itemId: item.item_Id, wishlistId: newWishlistId });
        sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  return (
    <button onClick={handleClick} title="Toggle Wishlist">
      {isWished ? (
        <FaHeart className="text-red text-lg transition" />
      ) : (
        <FaRegHeart className="text-lg hover:text-white text:primary transition" />
      )}
    </button>
  );
};

export default WishlistIcon;
