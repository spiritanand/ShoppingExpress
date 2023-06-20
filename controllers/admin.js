const Product = require('../models/product');
const { ERROR_MESSAGES } = require('../constants/constants');
const {
  handleCustomSequelizeError,
  handleNotLoggedInUser,
  handleResourceNotFound,
} = require('../utils/handleErrors');

exports.getProducts = async (req, res) => {
  try {
    if (!req.user) throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    const products = await req.user?.getProducts();

    if (!products) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

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
  const { name, imageURL, price, quantity, description } = req.body;
  try {
    if (!req.user) throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    await req.user?.createProduct({
      name,
      imageURL,
      price,
      quantity,
      description,
    });

    res.redirect('/');
  } catch (e) {
    handleNotLoggedInUser(e, res);
  }
};

exports.getEditProduct = async (req, res) => {
  const id = req.params?.productId;
  const editMode = req.query?.edit;

  try {
    if (!req.user || editMode !== 'true')
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    const products = await req.user?.getProducts({ where: { id } });

    const product = products[0];

    if (!products || !product)
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

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
  const { id, name, imageURL, price, quantity, description } = req.body;
  try {
    const product = await Product.findByPk(id);

    if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

    product.name = name;
    product.imageURL = imageURL;
    product.price = price;
    product.quantity = quantity;
    product.description = description;

    await product.save();

    res.redirect(`/products/${id}`);
  } catch (e) {
    handleResourceNotFound(e, res);
  }
};

exports.postDeleteProduct = async (req, res) => {
  const productId = req.body?.productId;

  try {
    const product = await Product.findByPk(productId);

    if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);

    await product.destroy();

    res.redirect('/admin/products');
  } catch (e) {
    handleResourceNotFound(e, res);
  }
};
