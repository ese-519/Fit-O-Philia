Router.route('/', function() {
	this.render('singleVideo');
});

Router.route('/orch', function() {
	this.render('orchestration');
});

Router.route('/examples', function() {
	this.render('examples');
});

