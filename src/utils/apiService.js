import axiosInstance from "../api/axiosInstance.js";

// register customer API's
export const registerCustomer = async (userData) => {
  try {
    const response = await axiosInstance.post(
      `Customer/RegisterCustomer`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Signup failed";
  }
};
// login customer API's
export const loginCustomer = async (loginData) => {
  try {
    const response = await axiosInstance.post(
      `Customer/LoginCustomer`,
      loginData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

export const countryAPI = {
  getAll: async (data) =>
    axiosInstance.get("Country/GetAllCountries", data).then((res) => res.data),
};

export const stateAPI = {
  getAll: async (data) =>
    axiosInstance.get("State/GetAllStates", data).then((res) => res.data),
};

//------------------ page ----------------------

// banner API's
export const bannerAPI = {
  getAll: async (data) =>
    axiosInstance.get("LandingPage/getAllImages", data).then((res) => res.data),
};

// All Items API's
export const allItemsAPI = {
  getAllItems: async (data) =>
    axiosInstance.post("Item/GetItems", data).then((res) => res.data),

  // getDiscountItems: async (data) =>
  //   axiosInstance.post("Item/GetItems", data).then((res) => res.data),

  getDiscountItems: async (customerId) =>
    axiosInstance
      .get(`Item/GetAllDiscountItems/${customerId}`)
      .then((res) => res.data),

  getNewArrivalItems: async (data) =>
    axiosInstance.post("Item/GetItems", data).then((res) => res.data),
};

// category API's
export const categoryAPI = {
  getAllCategory: async (data) =>
    axiosInstance
      .get("Categories/GetAllCategories", data)
      .then((res) => res.data),

  getProductByCategory: async (categoryId) =>
    axiosInstance
      .get(`Categories/ClickOnCategory/${categoryId}`)
      .then((res) => res.data),
};

// sub category API's
export const subCategoryAPI = {
  getAllSubCategory: async (data) =>
    axiosInstance
      .get("SubCategories/GetAllSubCategories", data)
      .then((res) => res.data),

  // getProductsBySubCategory: async (
  //   subCategoryId,
  //   pageNumber = 1,
  //   pageSize = 9
  // ) =>
  //   axiosInstance
  //     .post("Item/ClickOnSubCategory", {
  //       subCategoryId,
  //       pageNumber,
  //       pageSize,
  //     })
  //     .then((res) => res.data),
  getProductsBySubCategory: async (data) =>
    axiosInstance.post("Item/ClickOnSubCategory", data).then((res) => res.data),
};

// exploreArt API's
export const exploreArtAPI = {
  getAllExploreArtData: async (customerId) =>
    axiosInstance
      .get(`Categories/GetExploreItemImages/${customerId}`)
      .then((res) => res.data),
};


// discount API's
export const discountAPI = {
  getDiscountItems: async (data) =>
    axiosInstance
      .get("Item/getItemsWithDiscount", data)
      .then((res) => res.data),

  getAllDiscountItems: async (data) =>
    axiosInstance.get("Item/GetAllItems", data).then((res) => res.data),
};

// product detail API's
export const productDetailAPI = {
  getByItemCustomer: async (item_Id) =>
    axiosInstance
      .get(`Item/GetByItemCustomer/${item_Id}`)
      .then((res) => res.data),
};

// ------------- header -------------

// search API's
export const searchAPI = {
  searchItems: async (searchTerm) =>
    axiosInstance
      .get(`Item/SearchWithAllItemName?searchTerm=${searchTerm}`)
      .then((res) => res.data),
};

// wishlist API's
export const wishListAPI = {
  addToWishlist: async (payload) =>
    axiosInstance
      .post("WishList/AddToWishlist", payload)
      .then((res) => res.data),

  getWishlistByUser: async (customerId) =>
    axiosInstance
      .get(`WishList/GetWishlistByCustomer/${customerId}`)
      .then((res) => res.data),

  removeWishlistByUser: async (wishlistId) =>
    axiosInstance
      .delete(`WishList/RemoveFromWishlist/${wishlistId}`)
      .then((res) => res.data),
};

// cart API's
export const cartAPI = {
  addToCart: async (formData) =>
    axiosInstance
      .post("Cart/saveUpdate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  getCartListByCustomer: async (customerId) =>
    axiosInstance.get(`Cart/getByCustomerId/${customerId}`).then((res) => ({
      ...res.data,
      cartItems: res.data.cartItems || [],
    })),

  removeCartByUser: async (Cart_Id) =>
    axiosInstance.delete(`Cart/delete/${Cart_Id}`).then((res) => res.data),

  getBillingAddress: async (customerId) => {
    const res = await axiosInstance.get(
      `/Order/getBillingAddress/${customerId}`
    );
    return res.data;
  },

  confirmOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post(
        "Order/ConfirmOrder",
        orderData
      );
      return response.data;
    } catch (error) {
      console.error("Confirm Order API failed:", error);
      throw error;
    }
  },

  finalOrderByCartId: async (cartId) => {
    try {
      const response = await axiosInstance.get(
        `Order/finalOrderByCartId/${cartId}`
      );
      return response.data;
    } catch (error) {
      console.error("Final order API failed:", error);
      throw error;
    }
  },

  updateItemQty: async (payload) =>
    axiosInstance
      .post("Cart/UpdateCartQuantity", payload)
      .then((res) => res.data),
};

// attribute API's
export const attributeAPI = {
  getAllAttribute: async (data) =>
    axiosInstance
      .get("Attributes/GetAllAttributes", data)
      .then((res) => res.data),
};

// item API's
export const itemAPI = {
  discountItems: async () =>
    axiosInstance.get("Item/getItemsWithDiscount").then((res) => res.data),

  getAllItems: async () =>
    axiosInstance.get("Item/GetAllItems").then((res) => res.data),
};

// review API's
export const reviewAPI = {
  submitReview: async (payload) => {
    try {
      const response = await axiosInstance.post(
        "ItemReview/saveOrUpdate",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Failed to submit review:", error);
      throw error;
    }
  },

  getReviews: async () => {
    try {
      const response = await axiosInstance.get(
        "ItemReview/GetAllApprovedVisibleReviews"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      throw error;
    }
  },
};

// filter API's
// export const filterAPI = {
//   getRangePrice: async () => {
//     axiosInstance.get("Filter/GetAllPriceRange");
//   },

//   getFilterPrice: async (minPrice, maxPrice) => {
//     try {
//       const res = await axiosInstance.post("Filter/FilterItemsByPrice", {
//         minPrice,
//         maxPrice,
//       });
//       return res.data;
//     } catch (error) {
//       console.error("Error filtering by price:", error);
//       return null;
//     }
//   },

//   getSorting: async (id) => {
//     try {
//       const res = await axiosInstance.get(`Filter/GetItemsWithSorting/${id}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error getting sorting options:", error);
//       return [];
//     }
//   },
// };

export const filterAPI = {
  getRangePrice: async (pageNumber = 1, pageSize = 9) => {
    try {
      const res = await axiosInstance.post("Filter/GetPriceRangeWithItems", {
        PageNumber: pageNumber,
        PageSize: pageSize,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching price range:", error);
      return null;
    }
  },

  getFilterPrice: async (minPrice, maxPrice, pageNumber = 1, pageSize = 9) => {
    try {
      const res = await axiosInstance.post("Filter/FilterItemsByPrice", {
        minPrice,
        maxPrice,
        PageNumber: pageNumber,
        PageSize: pageSize,
      });
      return res.data;
    } catch (error) {
      console.error("Error filtering by price:", error);
      return null;
    }
  },

  getItemsByCategoryAndSubCategory: async (
    categoryIds = [],
    subCategoryIds = [],
    pageNumber = 1,
    pageSize = 9
  ) => {
    try {
      const res = await axiosInstance.post(
        "Filter/GetItemsByCategoryAndSubCategory",
        {
          CategoryIds: categoryIds,
          SubCategoryIds: subCategoryIds,
          PageNumber: pageNumber,
          PageSize: pageSize,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching category/subcategory items:", error);
      return null;
    }
  },

  getSorting: async (sortType = 1, pageNumber = 1, pageSize = 9) => {
    try {
      const res = await axiosInstance.post("Filter/GetItemsWithSorting", {
        sortType,
        pageNumber,
        pageSize,
      });
      return res.data;
    } catch (error) {
      console.error("Error getting sorted items:", error);
      return [];
    }
  },
};
