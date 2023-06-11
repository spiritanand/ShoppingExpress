const Product = require('../models/product');
const { render404View, handleSequelizeError } = require('./error');
const Cart = require('../models/cart');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    res.render('admin/products', {
      title: 'Products (Admin)',
      path: '/admin/products',
      products,
    });
  } catch (e) {
    handleSequelizeError(e, res);
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
    await Product.create({
      name,
      imageURL,
      price,
      quantity,
      description,
    });

    res.redirect('/');
  } catch (e) {
    handleSequelizeError(e, res);
  }
};

exports.getEditProduct = async (req, res) => {
  const id = req.params?.productId;
  const editMode = req.query?.edit;

  try {
    const product = await Product.findByPk(id);

    if (!product || editMode !== 'true') return render404View(res);

    return res.render('admin/edit-product', {
      title: `Edit - ${product.name}`,
      path: '/admin/edit-product',
      product,
      editMode,
    });
  } catch (e) {
    return handleSequelizeError(e, res);
  }
};

exports.postEditProduct = async (req, res) => {
  const { id, name, imageURL, price, quantity, description } = req.body;
  try {
    const product = await Product.findByPk(id);

    product.name = name;
    product.imageURL = imageURL;
    product.price = price;
    product.quantity = quantity;
    product.description = description;

    await product.save();
    // Cart.updateTotal(id, price);

    res.redirect(`/products/${id}`);
  } catch (e) {
    handleSequelizeError(e, res);
  }
};

exports.postDeleteProduct = async (req, res) => {
  const id = req.body?.productId;

  try {
    const product = await Product.findByPk(id);
    await product.destroy();

    res.redirect('/admin/products');
  } catch (e) {
    handleSequelizeError(e, res);
  }
};
