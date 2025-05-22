import { useState, useRef, useEffect } from "react";
import { Logo } from "../../utils";
import { IoPersonAdd } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { categoryAPI, subCategoryAPI } from "../../utils/apiService";
import { goToCategory, goToSubCategory } from "../../utils/navigationHandlers";
const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const navLinks = [
    { name: "New Arrivals", path: "/newArrivals" },
    { name: "All Products", path: "/allProducts" },
    { name: "Reviews", path: "/reviews" },
  ];
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartCount(stored.length);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await categoryAPI.getAllCategory();
        const subCategoryRes = await subCategoryAPI.getAllSubCategory();
        const publishedCategories = categoryRes.filter((c) => c.isPublish);
        const publishedSubCategories = subCategoryRes.filter(
          (s) => s.isPublish
        );
        const grouped = {};
        publishedCategories.forEach((cat) => {
          grouped[cat.category_Name] = publishedSubCategories
            .filter((sub) => sub.category_Id === cat.category_Id)
            .map((sub) => ({
              id: sub.sub_Category_Id,
              name: sub.sub_Category_Name,
              image: sub.sab_Category_Image,
            }));
        });
        setCategories(publishedCategories);
        setSubCategoriesMap(grouped);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setActiveCategory("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSideMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const renderCategories = (isMobile = false) => {
    if (isMobile) {
      return (
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-bold text-gray-700">
            Shop by Categories
          </h3>
          {categories.map((cat) => (
            <div
              key={cat.category_Id}
              className="flex items-center justify-between py-3 px-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 hover:border-accent transition-all"
              onClick={() => {
                setSideMenuOpen(false);
                goToCategory(navigate, cat.category_Id);
              }}
            >
              <span className="font-medium text-gray-800">
                {cat.category_Name}
              </span>
              <IoIosArrowForward className="text-gray-500" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="font-sans hidden lg:flex gap-6 text-lg font-bold tracking-wide text-secondary tracking-wider ">
        <div className="relative " ref={dropdownRef}>
          <button
            aria-haspopup="true"
            aria-expanded={showDropdown}
            className="flex items-center gap-1 hover:text-accent transition "
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            Shop by Categories <IoIosArrowDown />
          </button>
          {showDropdown && (
            <div className="absolute left-0 z-50 mt-2 flex bg-white rounded shadow-xl border">
              <ul className="w-64 bg-white p-4 space-y-2 border-r">
                {Object.keys(subCategoriesMap).map((cat) => (
                  <li
                    key={cat}
                    onMouseEnter={() => setActiveCategory(cat)}
                    onClick={() => {
                      const category = categories.find(
                        (c) => c.category_Name === cat
                      );
                      if (category) {
                        setShowDropdown(false);
                        goToCategory(navigate, category.category_Id);
                      }
                    }}
                    className={`flex justify-between items-center px-3 py-2 text-md font-bold tracking-wide cursor-pointer hover:bg-gray-100 rounded ${
                      activeCategory === cat ? "text-accent" : "text-gray-700"
                    }`}
                  >
                    {cat} <IoIosArrowForward />
                  </li>
                ))}
              </ul>
              {activeCategory && (
                <div className="w-[700px] p-6 bg-white">
                  <h4 className="font-bold text-accent text-xl tracking-wider text-sm mb-4">
                    View all {activeCategory} →
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {subCategoriesMap[activeCategory]?.map((item) => (
                      <div
                        key={item.id}
                        className="text-center cursor-pointer"
                        onClick={() => {
                          setShowDropdown(false);
                          goToSubCategory(navigate, item.id);
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded-md border shadow-sm"
                        />
                        <p className="mt-2 text-lg font-bold tracking-wide text-gray-700">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          onClick={() => setShowDropdown(false)}
          className={`${
            isMobile
              ? "font-sans block w-full text-lg font-bold text-accent py-4"
              : "font-sans hover:text-accent transition"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white shadow-md transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" onClick={() => setShowDropdown(false)}>
          <img
            src={Logo}
            alt="Logo"
            className={`transition-all duration-300 ${
              isScrolled ? "h-10 md:h-12" : "h-12 md:h-16"
            } object-contain`}
          />
        </Link>
        <div className="hidden lg:flex gap-8 text-lg font-bold tracking-wide text-secondary">
          {renderCategories()}
          {renderNavLinks()}
        </div>
        <div className="flex items-center gap-4 text-xl text-black">
          <Link to="/wishlist">
            <FiHeart className="text-2xl text-accent hover:text-primary transition-transform hover:scale-110" />
          </Link>
          <Link to="/cart" className="relative">
            <MdOutlineShoppingCart className="text-2xl text-accent hover:text-primary transition-transform hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1 animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/signin"
            className="hidden sm:flex items-center gap-1 text-2xl text-accent hover:text-primary transition-transform hover:scale-110"
          >
            <IoPersonAdd />
          </Link>
          <button
            onClick={() => setSideMenuOpen((prev) => !prev)}
            className="lg:hidden text-3xl"
          >
            {sideMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </div>
      {sideMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSideMenuOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 w-72 sm:w-80 h-full bg-white z-50 p-5 overflow-y-auto transition-transform duration-300 shadow-2xl ${
          sideMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6 border-b p-2 ">
          <h2 className="text-xl font-bold text-primary">Menu</h2>
          <button
            onClick={() => setSideMenuOpen(false)}
            className="text-3xl text-gray-600 hover:text-accent transition"
          >
            <HiOutlineX />
          </button>
        </div>
        <div>{renderCategories(true)}</div>
        <div className="p-2">{renderNavLinks(true)}</div>
      </div>
    </header>
  );
};
export default Header;
