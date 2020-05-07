const http = require('http');
const fs = require('fs');
const parser = require('./params.js'); //nos entrega un objeto
const renders = require('./render.js');

var p = parser.parse;
var r = renders.render;

http.createServer(function (req, res) {
    if(req.url.indexOf('favicon.ico') > 0) {return;};
    
    fs.readFile('./index.html', function(err, html) { 
        var html_string = html.toString();
        var parametros = p(req);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(r(html_string, parametros));
        res.end();
    });
}).listen(8080);