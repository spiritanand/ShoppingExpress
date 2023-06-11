const render404View = (res) => {
  res.status(404).render('404', {
    title: '404 Not Found',
    path: '',
  });
};

exports.get404 = (req, res) => {
  render404View(res);
};

exports.render404View = render404View;

exports.handleSequelizeError = (e, res) => {
  console.log(e);

  render404View(res);
};
