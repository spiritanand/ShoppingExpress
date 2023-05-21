const getExistingItem = (array, id) => {
  if (!Array.isArray(array)) return {};

  const existingItemIndex = array.findIndex((product) => product.id === id);
  const existingItem = array[existingItemIndex];

  return {
    existingItemIndex,
    existingItem,
  };
};

module.exports = getExistingItem;
