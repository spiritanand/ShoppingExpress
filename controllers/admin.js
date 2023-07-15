const Product = require('../models/product');
const { ERROR_MESSAGES } = require('../constants/constants');
const { handleCustomDBError } = require('../utils/handleErrors');
const { removeSpaces } = require('../utils/sanitizeInput');

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({ userID: req.session.user._id });

    res.render('admin/products', {
      title: 'Products (Admin)',
      products,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    product: {},
    editMode: false,
  });
};

exports.postAddProduct = async (req, res) => {
  const { _csrf, ...productInfo } = req.body;
  removeSpaces(productInfo);

  const user = req?.user;
  const { _id: userID } = user;

  try {
    const product = new Product({
      ...productInfo,
      userID,
    });

    await product.save();

    res.redirect('/');
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.getEditProduct = async (req, res) => {
  const productID = req.params?.productID;
  const editMode = req.query?.edit === 'true';

  try {
    const product = await Product.findById(productID);

    if (!editMode || product?.userID?.toString() !== req.user._id.toString())
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

    res.render('admin/edit-product', {
      title: `Edit - ${product.name}`,
      product,
      editMode,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.postEditProduct = async (req, res) => {
  const { productID, _csrf, ...updatedProduct } = req.body;
  removeSpaces(updatedProduct);

  try {
    const product = await Product.findById(productID);

    if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

    if (product?.userID?.toString() !== req.session.user._id.toString())
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    Object.assign(product, updatedProduct);

    await product.save();

    res.redirect(`/products/${productID}`);
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.postDeleteProduct = async (req, res) => {
  const productID = req.body?.productID;

  try {
    await Product.deleteOne({
      _id: productID,
      userID: req.session.user._id,
    });

    res.redirect('/admin/products');
  } catch (e) {
    handleCustomDBError(new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS), res);
  }
};
