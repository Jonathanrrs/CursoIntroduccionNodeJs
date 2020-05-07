const http = require('http');
const fs = require('fs');

//var html = fs.readFileSync('./index.html'); //sincrono
/*fs.readFile('./index.html', function(err, html) {  //asincrono
    http.createServer(function(req,res) {
        res.write(html);
        res.end();
        }).listen(8080);
    
});*/

//leer el archivo cada vez que se hace una petición //el html se va actualizar solo, pero reinciando la página

http.createServer(function (req, res) {
    fs.readFile('./index.html', function(err, html) { 
        res.write(html);
        res.end();
    });
}).listen(8080);


