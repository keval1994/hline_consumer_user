import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitleMap = {
  "/": "HiArt24",
  "/signup": "Sign Up",
  "/signin": "Sign In",
  "/wishlist": "Wishlist",
  "/cart": "Cart",
  "/checkOut": "Checkout",
  "/confirmOrder": "Confirm Order",
  "/orderSuccess": "Order Success",
  "/allProducts": "All Products",
  "/newarrivals": "New Arrivals",
  "/reviews": "Customer Reviews",
  "/Our-Story": "Our Story",
  "/Privacy-Policy": "Privacy Policy",
  "/Shipping-Policy": "Shipping Policy",
  "/Terms-Conditions": "Terms & Conditions",
  "/Return-Exchange-Policy": "Return & Exchange Policy",
};

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const defaultTitle = "HiArt24";
    const path = location.pathname;

    let title = routeTitleMap[path];
    if (!title) {
      if (path.startsWith("/productdetails")) title = "Product Details";
      else if (path.startsWith("/category")) title = "Category";
      else if (path.startsWith("/products")) title = "Products";
      else if (path.startsWith("/productlist")) title = "Product List";
    }

    document.title = title || defaultTitle;
  }, [location]);

  return null;
};

export default PageTitleUpdater;
