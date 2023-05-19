exports.get404 = (req, res) => {
	render404View(res);
};

const render404View = res => {
	res.status(404)
		.render('404', {
			title : '404 Not Found',
			path : '',
		});
};

exports.render404View = render404View;
