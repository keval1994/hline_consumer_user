import { useState, useRef, useEffect } from "react";
import { cartAPI, productDetailAPI, reviewAPI } from "../../utils/apiService";
import { Product01 } from "../../utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import CartDialog from "../Cart/CartDialog";
import { FaPalette } from "react-icons/fa";
import { GiBrainLeak } from "react-icons/gi";
import ItemCard from "../../common/ItemCard";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import Slider from "react-slick";
import { BsPinAngleFill } from "react-icons/bs";
import { LuMessageCircleWarning } from "react-icons/lu";
import { CiStar } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { notify } from "../../common/Toast";

const renderTwoUploadBoxes = (
  yourImageFile,
  setYourImageFile,
  referenceImageFile,
  setReferenceImageFile
) => (
  <div className="space-y-2">
    <div className="flex items-center gap-4 ">
      <div
        className="cursor-pointer text-gray-700 border border-gray-400 rounded-full px-12 py-1 text-sm font-medium hover:border-blue-500 hover:text-blue-700 transition-all duration-200"
        onClick={() => document.getElementById("yourImageUpload").click()}
      >
        Upload Your Image
      </div>
      {yourImageFile && (
        <div className="relative inline-block">
          <img
            src={URL.createObjectURL(yourImageFile)}
            alt="Your Upload"
            className="w-24 h-24 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => setYourImageFile(null)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
      <input
        id="yourImageUpload"
        type="file"
        accept="image/*"
        onChange={(e) => setYourImageFile(e.target.files[0])}
        className="hidden"
      />
    </div>

    <div className="flex items-center gap-4 ">
      <div
        className="cursor-pointer text-gray-700 border border-gray-400 rounded-full px-12 py-1 text-sm font-medium hover:border-blue-500 hover:text-blue-700 transition-all duration-200"
        onClick={() => document.getElementById("referenceImageUpload").click()}
      >
        Upload Reference Image :
      </div>
      {referenceImageFile && (
        <div className="relative inline-block">
          <img
            src={URL.createObjectURL(referenceImageFile)}
            alt="Reference Upload"
            className="w-24 h-24 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => setReferenceImageFile(null)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
      <input
        id="referenceImageUpload"
        type="file"
        accept="image/*"
        onChange={(e) => setReferenceImageFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  </div>
);

const renderCustomInput = (label, value, setter) => (
  <div>
    <h2 className="block text-xl font-bold">{label} :</h2>
    <input
      type="text"
      placeholder={`Enter ${label}`}
      value={value}
      onChange={(e) => setter(e.target.value)}
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 640, settings: { slidesToShow: 2 } },
    { breakpoint: 320, settings: { slidesToShow: 1 } },
  ],
};

const ProductDetails = () => {
  const sliderRef = useRef();
  const { item_Id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rightRef = useRef(null);
  const pageRef = useRef(null);
  const mainImageRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [yourImageFile, setYourImageFile] = useState(null);
  const [referenceImageFile, setReferenceImageFile] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [itemReviews, setItemReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const customerId = sessionStorage.getItem("customerId");
  const displayedReviews = itemReviews.slice(0, 3);
  const hasMoreReviews = itemReviews.length > 3;
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [adjustedPrice, setAdjustedPrice] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await productDetailAPI.getByItemCustomer(item_Id);
        setProductData(data);

        const item = data.items;
        const fetchedImages = [
          item.image_1,
          item.image_2,
          item.image_3,
          item.image_4,
          item.image_5,
        ].filter(Boolean);
        setImageUrls(fetchedImages);
        setSelectedImage(fetchedImages[0] || Product01);
        setRelatedProducts(data.related_Items || []);
        setItemReviews(data.item_Reviews || []);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };
    fetchProductDetails();
  }, [item_Id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!customerId) {
      notify("You must be log in to submit a review.");
      return;
    }
    const newReview = {
      Title: reviewTitle,
      ReviewText: reviewText,
      Rating: rating,
      Customer_Id: Number(customerId),
      Item_Id: Number(item_Id),
    };

    try {
      const response = await reviewAPI.submitReview(newReview);
      if (response && response.message === "Saved successfully.") {
        setReviews([newReview, ...reviews]);
        setReviewTitle("");
        setReviewText("");
        setRating(0);
      } else {
        notify("Something went wrong. Please try again.");
        console.error("Error: ", response);
      }
    } catch (error) {
      notify("Something went wrong. Please try again.");
      console.error("Failed to submit review:", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewAPI.getReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchReviews();
  }, []);

  const calculateAdjustedPrice = () => {
    const basePrice = productData?.items?.price || 0;
    const adjustments = Object.values(selectedAttributes).reduce(
      (acc, attr) => acc + (attr.price_Adjustment || 0),
      0
    );
    setAdjustedPrice(basePrice + adjustments);
  };
  useEffect(() => {
    if (productData?.items) {
      calculateAdjustedPrice();
    }
  }, [selectedAttributes, productData]);

  const renderPaletteRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaPalette
            key={star}
            onClick={() => setRating(star)}
            className={`w-7 h-7  cursor-pointer transition-transform duration-200 ${
              rating >= star ? "text-yellow-500" : "text-gray-400"
            } ml-2 mr-2`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = async () => {
    if (!customerId) {
      navigate("/signin", {
        state: {
          from: location.pathname,
          intendedAction: { type: "add_to_cart", item: productData.items },
        },
      });
      return;
    }
    // const requiredAttributeCount = Object.keys(groupedAttributes || {}).length;
    // const selectedAttributeCount = Object.keys(selectedAttributes || {}).length;
    // if (selectedAttributeCount < requiredAttributeCount) {
    //   notify("Please select required attributes.", "warning");
    //   return;
    // }
    try {
      const totalAmount = adjustedPrice * quantity;
      const netAmount =
        totalAmount - (totalAmount * productData.items.discount) / 100;

      const formData = new FormData();
      formData.append("Customer_Id", customerId);
      formData.append("Item_Id", productData.items.item_Id);
      formData.append("Price", adjustedPrice);
      formData.append("Qty", quantity);
      formData.append("Total_Amount", totalAmount);
      formData.append("Created_By", customerId);
      formData.append("Modified_By", customerId);
      formData.append("Discount", productData.items.discount);
      formData.append("Net_Amount", netAmount);

      const dummyFile = new File([""], "dummy.png");
      formData.append("Image", yourImageFile || dummyFile);
      formData.append("Reference_Picture", referenceImageFile || dummyFile);

      const selectedAttrValues = Object.values(selectedAttributes);
      selectedAttrValues.forEach((attr, index) => {
        formData.append(`Attributes[${index}].AttributeId`, attr.attribute_Id);
        formData.append(
          `Attributes[${index}].Value`,
          `${attr.attribute_Value} ${attr.unit_Name || ""}`
        );
      });

      if (customText.trim() !== "") {
        formData.append("custom_Text", customText.trim());
      }
      if (customColor.trim() !== "") {
        formData.append("custom_Color", customColor.trim());
      }
      if (customDetails.trim() !== "") {
        formData.append("custom_Details", customDetails.trim());
      }

      await cartAPI.addToCart(formData);
      notify("Item added to cart successfully!", "success");
      setSelectedItem(productData.items);
      setShowCartDialog(true);

      setTimeout(async () => {
        try {
          await cartAPI.getCartListByCustomer(customerId);
        } catch (err) {
          console.error("Cart fetch after add failed:", err);
        }
      }, 500);
    } catch (error) {
      notify("Failed to add item to cart. Please try again.", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!customerId) {
      navigate("/signin", {
        state: {
          from: location.pathname,
          intendedAction: { type: "buy_now", item: productData.items },
        },
      });
      return;
    }
    // const requiredAttributeCount = Object.keys(groupedAttributes || {}).length;
    // const selectedAttributeCount = Object.keys(selectedAttributes || {}).length;
    // if (selectedAttributeCount < requiredAttributeCount) {
    //   notify("Please select required attributes.", "warning");
    //   return;
    // }
    try {
      const existingCart = await cartAPI.getCartListByCustomer(customerId);
      const existingItem = existingCart.cartItems?.find(
        (i) => i.item_Id === productData.items.item_Id
      );

      const qty = existingItem ? existingItem.qty + quantity : quantity;
      const price = productData.items.price || 0;
      const total = price * qty;

      const formData = new FormData();
      formData.append("Customer_Id", customerId);
      formData.append("Item_Id", productData.items.item_Id);
      formData.append("Price", price);
      formData.append("Qty", qty);
      formData.append("Total_Amount", total);
      formData.append("Created_By", 1);
      formData.append("Modified_By", 1);
      formData.append("Discount", 0);
      formData.append("Net_Amount", total);

      const dummyFile = new File([""], "dummy.png");
      formData.append("Image", yourImageFile || dummyFile);
      formData.append("Reference_Picture", referenceImageFile || dummyFile);

      Object.values(selectedAttributes).forEach((attr, index) => {
        formData.append(`Attributes[${index}].AttributeId`, attr.attribute_Id);
        formData.append(
          `Attributes[${index}].Value`,
          `${attr.attribute_Value} ${attr.unit_Name || ""}`
        );
      });
      if (customText.trim() !== "") {
        formData.append("custom_Text", customText.trim());
      }
      if (customColor.trim() !== "") {
        formData.append("custom_Color", customColor.trim());
      }
      if (customDetails.trim() !== "") {
        formData.append("custom_Details", customDetails.trim());
      }

      await cartAPI.addToCart(formData);
      notify("Item added successfully! Redirecting to checkout...", "success");
      navigate("/checkout");
    } catch (error) {
      notify("Buy now failed. Please try again.", "error");
    }
  };

  useEffect(() => {
    if (imageUrls.length > 0) {
      setSelectedImage(imageUrls[currentImageIndex]);
    }
  }, [currentImageIndex, imageUrls]);

  const nextSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    setSelectedImage(imageUrls[currentImageIndex]);
  }, [currentImageIndex]);

  const groupedAttributes = productData?.item_Attribute?.reduce((acc, curr) => {
    const key = curr.attribute_Name;
    if (!acc[key]) {
      acc[key] = {
        unit_Name: curr.unit_Name,
        options: [],
      };
    }
    acc[key].options.push(curr);
    return acc;
  }, {});

  return (
    <>
      <div
        ref={pageRef}
        className="bg-soft overflow-x-hidden snap-y snap-mandatory scrollbar-hide"
      >
        <div className="container mx-auto px-2 py-4">
          {/* <Breadcrumb pageName={productData?.items?.item_Name} /> */}

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex flex-col items-center py-10">
              <div className="w-full max-w-[600px] flex flex-col items-center space-y-6">
                <div className="relative w-full flex items-center justify-center">
                  <button
                    onClick={prevSlide}
                    className="hidden md:block absolute -left-2 z-10 text-white bg-primary p-3 rounded-full"
                  >
                    <FaChevronLeft size={24} />
                  </button>

                  <div
                    ref={mainImageRef}
                    className="relative w-[500px] h-[500px] rounded-xl overflow-hidden border cursor-move"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => {
                      setIsZoomed(false);
                      setZoomStyle({
                        transform: "scale(1)",
                        transformOrigin: "center",
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect = mainImageRef.current.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setZoomStyle({
                        transform: "scale(2)",
                        transformOrigin: `${x}% ${y}%`,
                      });
                      setCursorPosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                  >
                    <img
                      src={selectedImage}
                      alt="Product"
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                      style={zoomStyle}
                    />
                  </div>

                  <button
                    onClick={nextSlide}
                    className="hidden md:block absolute -right-2 z-10 text-white bg-primary p-3 rounded-full"
                  >
                    <FaChevronRight size={24} />
                  </button>
                </div>
                <div className="flex justify-center gap-3">
                  {imageUrls.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-[110px] h-[100px] rounded-lg overflow-hidden border-2 cursor-pointer ${
                        currentImageIndex === idx
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={rightRef}
              className="scrollbar-hide w-full md:w-1/2 overflow-y-auto px-6 py-10 text-[#051747] space-y-6"
            >
              {productData?.items && (
                <div className="space-y-4 mx-auto">
                  <h1 className="text-4xl font-bold ">
                    {productData.items.item_Name}
                  </h1>
                  <div className="flex items-center gap-8">
                    <div className="text-xl font-bold">
                      Price:{" "}
                      <span className="font-medium text-green-600">
                        ₹{adjustedPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xl font-bold ">
                      Discount :{" "}
                      <span className="font-medium">
                        {productData.items.discount}%
                      </span>
                    </div>
                  </div>

                  {renderTwoUploadBoxes(
                    yourImageFile,
                    setYourImageFile,
                    referenceImageFile,
                    setReferenceImageFile
                  )}

                  {productData.item_Specification?.length > 0 && (
                    <div>
                      <label className="block text-2xl font-bold mb-4">
                        Specification:
                      </label>
                      <div className="text-md leading-relaxed text-gray-700 clean-html">
                        {productData?.item_Specification?.length > 0 && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                productData.item_Specification[0].specification,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl font-extrabold mb-4">
                      Select Attribute :
                    </h2>
                    <div className="space-y-3">
                      {groupedAttributes &&
                        Object.entries(groupedAttributes).map(
                          ([attrName, { options }], index) => (
                            <div key={index}>
                              <h2 className="text-xl font-bold mb-2">
                                {attrName}:
                              </h2>
                              <div className="flex flex-wrap gap-4">
                                {options.map((opt, idx) => {
                                  const isSelected =
                                    selectedAttributes[opt.attribute_Id]
                                      ?.attribute_Value === opt.attribute_Value;

                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setSelectedAttributes((prev) => {
                                          const isAlreadySelected =
                                            prev[opt.attribute_Id]
                                              ?.attribute_Value ===
                                            opt.attribute_Value;

                                          if (isAlreadySelected) {
                                            const updated = { ...prev };
                                            delete updated[opt.attribute_Id];
                                            return updated;
                                          }

                                          return {
                                            ...prev,
                                            [opt.attribute_Id]: opt,
                                          };
                                        });
                                      }}
                                      className={`px-4 py-2 rounded-full border shadow-sm transition-all flex flex-col ${
                                        isSelected
                                          ? "bg-primary text-white border-primary"
                                          : "bg-white text-[#051747] border-gray-300 hover:shadow-md"
                                      }`}
                                    >
                                      {opt.attribute_Value} - {opt.unit_Name}
                                      {opt.price_Adjustment > 0 && (
                                        <span className="text-xs ml-2 text-green-600">
                                          ₹{opt.price_Adjustment}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  {renderCustomInput("Custom Text", customText, setCustomText)}
                  {renderCustomInput(
                    "Custom Colour",
                    customColor,
                    setCustomColor
                  )}
                  {renderCustomInput(
                    "Customization Details",
                    customDetails,
                    setCustomDetails
                  )}

                  <div>
                    <label className="block text-xl font-bold mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-full overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="w-10 h-10 text-xl flex items-center justify-center hover:bg-gray-100"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setQuantity(!isNaN(val) && val > 0 ? val : 1);
                          }}
                          onBlur={(e) => {
                            if (!e.target.value || parseInt(e.target.value) < 1)
                              setQuantity(1);
                          }}
                          className="w-16 text-center border-x border-gray-200 py-2 focus:outline-none no-spinner"
                        />
                        <button
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className="w-10 h-10 text-xl flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <button
                      onClick={handleAddToCart}
                      className="py-3 bg-primary text-white rounded-lg shadow hover:bg-secondary"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="py-3 bg-secondary text-white rounded-lg shadow hover:bg-gray-300 hover:text-black"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="container ">
            <div className="">
              <div className="flex items-center justify-between relative">
                <div className="text-left">
                  <h2 className="text-4xl font-black text-primary">
                    Recommended Products
                  </h2>
                  <div className="flex items-center mt-2">
                    <div className="w-24 h-px bg-gray-300"></div>
                    <GiBrainLeak className="text-3xl text-gray-600 mx-5 animate-spin-slow" />
                    <div className="w-24 h-px bg-gray-300"></div>
                  </div>
                </div>

                {relatedProducts.length > 4 && (
                  <div className="flex gap-2 items-center">
                    <div
                      className="custom-prev bg-white shadow-md rounded-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all hover:scale-110"
                      onClick={() => sliderRef.current?.slickPrev()}
                    >
                      <GoArrowRight size={20} />
                    </div>
                    <div
                      className="custom-next bg-white shadow-md rounded-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all hover:scale-110"
                      onClick={() => sliderRef.current?.slickNext()}
                    >
                      <GoArrowLeft size={20} />
                    </div>
                  </div>
                )}
              </div>

              {relatedProducts.length > 4 ? (
                <Slider
                  ref={sliderRef}
                  {...sliderSettings}
                  className="!pb-12 mt-6"
                >
                  {relatedProducts.map((item, idx) => (
                    <div key={idx} className="flex justify-center px-2">
                      <ItemCard
                        item={item}
                        setSelectedItem={setSelectedItem}
                        setShowCartDialog={setShowCartDialog}
                        gridView="3col"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${relatedProducts.length} gap-6 mt-6`}
                >
                  {relatedProducts.map((item, idx) => (
                    <ItemCard
                      key={idx}
                      item={item}
                      setSelectedItem={setSelectedItem}
                      setShowCartDialog={setShowCartDialog}
                      gridView="3col"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="container ">
            <div className="">
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="flex items-center gap-2 text-lg font-semibold text-[#051747] hover:text-primary transition hover:scale-105"
                >
                  Write a Review <FaArrowRightLong />
                </button>
              )}
            </div>
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="space-y-6 p-6 border"
              >
                <h1 className="text-xl font-bold text-[#051747] border-b pb-2 border-accent ">
                  Write Review
                </h1>

                <div className="space-y-2">
                  <label className="flex items-center text-lg text-[#051747] gap-2">
                    <CiStar /> Rating
                  </label>
                  {renderPaletteRating()}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-lg text-[#051747] gap-2">
                    <BsPinAngleFill /> Review Title
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                    placeholder="Great product!"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-lg text-[#051747] gap-2">
                    <LuMessageCircleWarning /> Review Message
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    placeholder="Share your experience..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-md bg-primary text-white hover:bg-secondary transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
            {itemReviews.length === 0 ? (
              <p className="text-gray-500 italic">
                No reviews yet. Be the first to write one!
              </p>
            ) : (
              <>
                <div>
                  {displayedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 transition-all duration-300 space-y-3 border-b border-accent"
                    >
                      <h1 className="text-accent text-xl font-semibold border-b pb-2 border-accent">
                        Reviews
                      </h1>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {[...Array(rev.rating)].map((_, j) => (
                            <FaStar
                              key={j}
                              className="text-yellow-400 text-sm"
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center justify-end">
                          {rev.created_Date}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#051747] text-white text-xl flex items-center justify-center font-bold">
                          <IoPersonOutline />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#051747]">
                            {rev.customer_Name || "Customer"}
                          </h4>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-primary">
                          {rev.title}
                        </h5>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                          {rev.reviewText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreReviews && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => navigate("/reviews")}
                      className="px-6 py-2 rounded-full bg-[#051747] text-white font-semibold hover:bg-primary transition"
                    >
                      Read More Reviews
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          <CartDialog
            isOpen={showCartDialog}
            onClose={() => setShowCartDialog(false)}
            item={selectedItem}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
