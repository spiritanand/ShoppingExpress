const Product = require('../models/product');
const { render404View } = require('./error');
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
    console.log(e);
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
    console.log(e);
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
    console.log(e);

    return render404View(res);
  }
};

exports.postEditProduct = (req, res) => {
  const { id, name, imageURL, price, quantity, description } = req.body;
  const product = new Product(name, imageURL, price, quantity, description, id);
  product.save();
  Cart.updateTotal(id, price);
  res.redirect(`/products/${id}`);
};

exports.postDeleteProduct = (req, res) => {
  const id = req.body?.productId;
  Product.deleteById(id);
  res.redirect('/admin/products');
};
