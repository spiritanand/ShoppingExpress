const Product = require('../models/product');
const { ERROR_MESSAGES } = require('../constants/constants');
const { handleCustomSequelizeError } = require('../utils/handleErrors');

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.getAll();

    res.render('admin/products', {
      title: 'Products (Admin)',
      path: '/admin/products',
      products,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    product: {},
    editMode: false,
  });
};

exports.postAddProduct = async (req, res) => {
  const { name, price, description, quantity, imageURL } = req.body;
  const user = req?.user;
  const { _id: userID } = user;

  const product = new Product(
    name,
    price,
    description,
    quantity,
    imageURL,
    null,
    userID
  );

  await product.save();

  res.redirect('/');
};

exports.getEditProduct = async (req, res) => {
  const id = req.params?.productId;
  const editMode = req.query?.edit === 'true';

  try {
    if (!editMode) throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    const product = await Product.findById(id);

    if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

    res.render('admin/edit-product', {
      title: `Edit - ${product.name}`,
      path: '/admin/edit-product',
      product,
      editMode,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postEditProduct = async (req, res) => {
  const {
    id: productID,
    name,
    imageURL,
    price,
    quantity,
    description,
  } = req.body;
  const user = req?.user;
  const { _id: userID } = user;

  try {
    const product = new Product(
      name,
      price,
      description,
      quantity,
      imageURL,
      productID,
      userID
    );

    await product.save();

    res.redirect(`/products/${productID}`);
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postDeleteProduct = async (req, res) => {
  const productId = req.body?.productId;

  try {
    await Product.deleteById(productId);

    res.redirect('/admin/products');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};
