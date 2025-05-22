export const goToCategory = (navigate, categoryId) => {
  navigate(`/category/${categoryId}`);
};

export const goToSubCategory = (navigate, subCategoryId) => {
  navigate(`/products/${subCategoryId}`);
};
