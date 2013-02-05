'use strict';

var sys = require('sys'),  
	http = require('http'),  
	path = require('path'),  
	url = require('url'),  
	fs = require('fs'),
	mime = require('mime');

var HOST = 'localhost',
	PORT = 1337;

// http://roguejs.com/2011-11-30/console-colors-in-node-js/
var colors = {
	bright	: '\u001b[1m',
	red		: '\u001b[31m',
	green	: '\u001b[32m',
	yellow	: '\u001b[33m',
	blue	: '\u001b[34m',
	magenta	: '\u001b[35m',
	cyan	: '\u001b[36m',
	white	: '\u001b[37m',
	reset	: '\u001b[0m'
};

var app = function onCallback(request, response) {
	var uri = url.parse(request.url).pathname, 
		filename = path.join(process.cwd(), uri);
	
	fs.exists(filename, function(exists) {  
		console.log(request.url);
		
		if (!exists) {
			response.writeHeader(404, { 'Content-Type': 'text/plain' });    
			response.write('404 Not Found\n');    
			response.end();  
			return;
		}
		 
		if (fs.statSync(filename).isDirectory()) {
			filename += '/index.html';
		}

		fs.readFile(filename, 'binary', function(err, file) {    
			 if (err) {    
				 response.writeHeader(500, { 'Content-Type': 'text/plain' });    
				 response.write(err + '\n');    
				 response.end();    
			 } else {  
				response.writeHead(200, { 'Content-Type': mime.lookup(filename) });
				response.write(file, 'binary');    
				response.end();  
			}  
		});  
	});  
};

http.createServer(app).listen(PORT, HOST, function onCallback() {
	console.log(colors.green + 'Server running on http://' + HOST + ':' + PORT + '...' + 
				'\n' + colors.magenta + 'Press Ctrl+C to stop!' + colors.reset);
}).on('error', function onError(e) {
	if (e.code === 'EADDRINUSE') {
		console.log(colors.bright + colors.red + 'Port (' + PORT + ') already in use!' + colors.reset);
	}
});