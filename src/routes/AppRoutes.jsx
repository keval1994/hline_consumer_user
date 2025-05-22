import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ProductList from "../pages/Category/productList";
import CategoryList from "../pages/Category/CategoryList";
import ProductDetails from "../components/Prodcuts";
import NewArrivals from "../components/Pages/NewArrivals";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import Reviews from "../components/Pages/Reviews";
import WishList from "../components/WishList";
import Cart from "../components/Cart";
import OurStory from "../components/Pages/Policy/ourStory";
import PrivacyPolicy from "../components/Pages/Policy/privacyPolicy";
import ShippingPolicy from "../components/Pages/Policy/shippingPolicy";
import TermsConditions from "../components/Pages/Policy/termsConditions";
import ReturnExchangePolicy from "../components/Pages/Policy/returnExchangePolicy";
import AllProducts from "../components/Pages/AllProducts";
import CheckOut from "../components/CheckOut/index";
import ConfirmOrder from "../components/ConfirmOrder";
import OrderSuccess from "../components/OrderSuccess";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/category/:categoryId" element={<CategoryList />} />
    <Route path="/products/:subCategoryId" element={<ProductList />} />
    <Route path="/productlist/:subCategoryId" element={<ProductList />} />
    <Route path="/productdetails/:item_Id" element={<ProductDetails />} />
    <Route path="/allProducts" element={<AllProducts />} />
    <Route path="/newarrivals" element={<NewArrivals />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/reviews" element={<Reviews />} />
    <Route path="/wishlist" element={<WishList />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkOut" element={<CheckOut />} />
    <Route path="/confirmOrder" element={<ConfirmOrder />} />
    <Route path="/orderSuccess" element={<OrderSuccess />} />
    <Route path="/Our-Story" element={<OurStory />} />
    <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
    <Route path="/Shipping-Policy" element={<ShippingPolicy />} />
    <Route path="/Terms-Conditions" element={<TermsConditions />} />
    <Route path="/Return-Exchange-Policy" element={<ReturnExchangePolicy />} />
  </Routes>
);

export default AppRoutes;
