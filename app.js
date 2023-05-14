const express = require('express');
const path = require('path');

const app = express();

// globally setting values across our app
app.set('view engine', 'ejs');
// app.set('views', 'views'); // set automatically. no need to call explicitly

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// handling routes
// place more specific routes on the top always
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404)
	 .render('404', {title: '404 Not Found', path:""});
  // .sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(8080);

// module.exports = path.dirname(require.main.filename);
