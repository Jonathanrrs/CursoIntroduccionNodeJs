const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('./index.html', function(err, html) { 
        //convertir el html en una cadena
        var html_string = html.toString();
        //usamos expresiones regulares
        //manera de agrupar expresiones en una cadena
        //Expresion regular que busca en el html donde haya {x}
        var variables = html_string.match(/[^\{\}]+(?=\})/g);
        var nombre = 'Ramirito Sandoval';
        // variable ['nombre']
        for (var i = variables.length - 1; i >= 0; i--) {
            //Lo ejecutamos como codigo de javascript
            //Para obtener el valor de dicha variable
            var value  = eval(variables[i]);
            //Remplazar el contenido con llaves {x} por su valor correspondiente
            html_string = html_string.replace('{'+variables[i]+'}', value);
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html_string);
        res.end();
    });
}).listen(8080);