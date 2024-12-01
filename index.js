'use strict'

//importar mongoose
var mongoose = require('mongoose');

//servidor
var app = require('./app'); //ruta del archivo
var port = 3800;

//conectar a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
.then(() => {
	console.log('Conexion a la base de datos establecida con éxito');

	//servidor
	app.listen(port, () => {
		console.log("Servidor node corriendo: localhost:3800");
	});
}).
catch(err => {
	console.log(err);
});