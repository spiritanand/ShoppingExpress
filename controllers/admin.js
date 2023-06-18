const Product = require('../models/product');
const { render404View } = require('./error');

exports.getProducts = async (req, res) => {
  const products = await req.user.getProducts();

  res.render('admin/products', {
    title: 'Products (Admin)',
    path: '/admin/products',
    products,
  });
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

  await req.user.createProduct({
    name,
    imageURL,
    price,
    quantity,
    description,
  });

  res.redirect('/');
};

exports.getEditProduct = async (req, res) => {
  const id = req.params?.productId;
  const editMode = req.query?.edit;

  const products = await req.user.getProducts({ where: { id } });
  const product = products[0];

  if (!product || editMode !== 'true') return render404View(res);

  return res.render('admin/edit-product', {
    title: `Edit - ${product.name}`,
    path: '/admin/edit-product',
    product,
    editMode,
  });
};

exports.postEditProduct = async (req, res) => {
  const { id, name, imageURL, price, quantity, description } = req.body;
  const product = await Product.findByPk(id);

  product.name = name;
  product.imageURL = imageURL;
  product.price = price;
  product.quantity = quantity;
  product.description = description;

  await product.save();

  res.redirect(`/products/${id}`);
};

exports.postDeleteProduct = async (req, res) => {
  const productId = req.body?.productId;

  const product = await Product.findByPk(productId);
  await product.destroy();

  res.redirect('/admin/products');
};
