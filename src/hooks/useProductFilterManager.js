import { useState, useEffect } from "react";

const useProductFilterManager = (initialProducts = []) => {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [gridView, setGridView] = useState("3col");
  const [sortBy, setSortBy] = useState("default sorting");
  const [noItemsMessage, setNoItemsMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCartDialog, setShowCartDialog] = useState(false);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleApplySubCategoryFilter = (subCategoryProducts) => {
    if (subCategoryProducts.length === 0) {
      setFilteredProducts([]);
      setNoItemsMessage("No products found for selected subcategories.");
    } else {
      const unique = Array.from(
        new Map(
          subCategoryProducts.map((item) => [item.item_Id, item])
        ).values()
      );
      setFilteredProducts(unique);
      setNoItemsMessage("");
    }
  };

  const handleSortedProducts = (sortedData, selectedSort) => {
    if (sortedData.length > 0) {
      setFilteredProducts(sortedData);
      setNoItemsMessage("");
    } else {
      setFilteredProducts([]);
      setNoItemsMessage("No products found for selected sort.");
    }
    setSortBy(selectedSort);
  };

  return {
    products,
    filteredProducts,
    setProducts,
    setFilteredProducts,
    itemsPerPage,
    setItemsPerPage,
    gridView,
    setGridView,
    sortBy,
    setSortBy,
    noItemsMessage,
    setNoItemsMessage,
    selectedItem,
    setSelectedItem,
    showCartDialog,
    setShowCartDialog,
    handleApplySubCategoryFilter,
    handleSortedProducts,
  };
};

export default useProductFilterManager;
