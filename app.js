var express = require('express');
var bodyParser = require('body-parser');
var app = express();


//archivos de rutas
var project_routes = require('./routes/project');
//middlerwares
//configuración para usar body parser
app.use(bodyParser.urlencoded({extended: false}));
//todo lo que llegue se convierta a JSON
app.use(bodyParser.json());

//cors
// Configurar cabeceras y cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

//rutas
//en este caso al teber las rutas externas se crea un middlerware de la ruta
app.use('/', project_routes);
//si quueri agregar un tipo se nombre estra a la ruta hago esto
//app.use('/api', project_routes);

//exportar
module.exports = app;