const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('./index.html', function(err, html) { 
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.write(JSON.stringify({Nombre: 'Jonathan', username: 'Joni'}));
        //res.write(html);
        res.end();
    });
}).listen(8080);