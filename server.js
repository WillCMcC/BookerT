// Initial Varibales

var port = process.env.PORT || 6969;

//  Requirements
var http = require("http");
var db = require('./sequelize.js');

// init server
var server = http.createServer();

// server listen on port
server.listen(port, function(){
	console.log('Listening on port ' + port);
});
