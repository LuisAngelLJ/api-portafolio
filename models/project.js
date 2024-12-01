'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//esquema que se va a guardar en la BD
var ProjectSchema = Schema({
	name: String,
	description: String,
	category: String,
	year: Number,
	langs: String,
	image: String
});

/*
enviar a la BD - en el primer parametro se escribe en singular y la primera
en mayuscula porque al enviar lo convierte a plural y a minuscula
*/
module.exports = mongoose.model('Project', ProjectSchema);