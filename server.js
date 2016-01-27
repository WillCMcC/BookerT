// Initial Varibales

var port = process.env.PORT || 6969;

//  Requirements
var http = require("http");
var models = require("./models");
var app = require("./routes/routes.js");



// var testing = require('./dbTesting.js');


// init server

// server listen on port


models.sequelize.sync().then(function () {
	var server = http.createServer(app);
	server.listen(port, function(){
		console.log('Listening on port ' + port);
	});
});
