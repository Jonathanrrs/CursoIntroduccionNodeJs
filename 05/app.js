const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {

    if(req.url.indexOf('favicon.ico') > 0) {return;};
     /*console.log('=======\n\n');
    console.log(req);
    console.log('=======\n\n');*/

    
    


    fs.readFile('./index.html', function(err, html) { 
        var html_string = html.toString();
        var arreglo_parametros = [], parametros = {};  //hash de paramatros
        var variables = html_string.match(/[^\{\}]+(?=\})/g);
        var nombre = '';
        if(req.url.indexOf('?') > 0) {
            // /?nombre=Joni
            var url_data = req.url.split('?');
            var arreglo_parametros = url_data[1].split('&');
        }
        for (let i = arreglo_parametros.length-1; i >= 0; i--) {
            var parametro = arreglo_parametros[i];
            //nombre=Joni

            var param_data = parametro.split('=');
            //[nombre, Joni]
            parametros[param_data[0]] = param_data[1];
            //{nombre: 'Jona'}
            
        };
        for (var i = variables.length - 1; i >= 0; i--) {
            //[nombre, appellido]
            var variable = variables[i];
            // parametros[variable]
            // parametros[nonbre]
            html_string = html_string.replace('{'+variables[i]+'}', parametros[variable]);
            
        };
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html_string);
        res.end();
    });
}).listen(8080);