const express = require('express');
const path = require('path');

const app = express();

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
	 .sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(8080);

// module.exports = path.dirname(require.main.filename);
