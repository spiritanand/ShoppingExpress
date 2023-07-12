const Product = require('../models/product');
const { handleCustomDBError } = require('../utils/handleErrors');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.render('shop/index', {
      title: 'Shopping Express',
      products,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.getProductDetail = async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findById(productID);

    res.render('shop/product-detail', {
      title: `Product Detail - ${product?.name}`,
      product,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};
