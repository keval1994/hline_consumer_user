import { useEffect, useState } from "react";
import { wishListAPI } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import ItemCard from "../../common/ItemCard";
import Breadcrumb from "../../common/Breadcrumb";
import ArtBlobLoader from "../../common/Loader/ArtBlobLoader ";
import CartDialog from "../Cart/CartDialog";

const WishList = () => {
  const [wishListItems, setWishListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    if (!customerId) {
      navigate("/signin");
    }
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await wishListAPI.getWishlistByUser(customerId);
        setWishListItems(data);
        const sessionData = data.map((item) => ({
          itemId: item.item_Id,
          wishlistId: item.wishlist_Id,
        }));
        sessionStorage.setItem("wishlist", JSON.stringify(sessionData));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <ArtBlobLoader />;

  return (
    <div className="bg-soft  py-10 px-4 lg:px-20 font-sans">
      <div className="container mx-auto">
        <div className="ml-5">
          <Breadcrumb pageName="Your Wishlist" />
        </div>
        {wishListItems.length === 0 ? (
          <div className="text-center mt-12 text-gray-600 text-lg">
            No items in wishlist.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishListItems.map((item) => (
              <ItemCard
                key={item.wishlistId}
                item={item}
                setSelectedItem={setSelectedItem}
                setShowCartDialog={setShowCartDialog}
                gridView="grid"
              />
            ))}
          </div>
        )}
      </div>
      <CartDialog
        isOpen={showCartDialog}
        onClose={() => setShowCartDialog(false)}
        item={selectedItem}
      />
    </div>
  );
};
export default WishList;
