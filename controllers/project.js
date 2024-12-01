'use strict'

//para hacer cualquier opación con la bse projects se importa el modelo
var Project = require('../models/project');

//importar el file system para borrar imagenes de la carpeta
var fs = require('fs');

//para saber la ruta de una imagen
var path = require('path');

var controller = {
	home: function(req, res) {
		return res.status(200).send({
			message: 'Soy la home'
		});
	},


	//Guardar un proyecto
	saveProject: function (req, res){
		//instanciar el modelo
		var project = new Project();

		//obtener los datos que envian
		var params = req.body; 
		//asignar a los parametos del esquema de modelo los valores que recibo
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;


		//guardar el esquema en la base de datos recibe un error o respuesta(como le queramos llamar)
		project.save((err, projectStored) => {
			//en el caso de error
			if(err) return res.status(500).send({message: 'Error al guardar'});

			//en el caso de que no se guarde
			if(!projectStored) return res.status(404).send({message: 'No se logro guardar el proyecto'});

			//si todo esta correcto
			return res.status(200).send({project: projectStored});
		});
	},

	//Buscar projecto
	getProject: function(req, res) {
		//vamos a tomar un valor por url para hacer una consulta
		var projectId = req.params.id;

		//si no ponen el id por url ya que es opcional
		if(projectId == null) {
			res.status(404).send({message: 'No se ha encontrado el proyecto'});
		}

		//buscar mediante el ORM
		Project.findById(projectId, (err, project) => {
			//si da error
			if(err) return res.status(500).send({message: 'Error al consultar'});

			//en el caso de que no encuentre nada
			if(!project) return res.status(404).send({message: 'No se ha encontrado el proyecto'});

			//si todo esta correcto
			return res.status(200).send({project});
		})
	},


	//Listar proyectos
	getProjects: function(req, res) {
		/*
		si adentro del find le pongo un parametro de la base de datos me sacara todos los proyectos que tengan esa coincidencia
		Project.find({year:2019}).exec((err, projects)
		si quiero ordenar por año de menor a mayor
		Project.find({}).short('year').exec((err, projects)
		mayor a menor
		Project.find({}).short('-year').exec((err, projects)
		*/
		Project.find({}).exec((err, projects) => {
			if(err) return res.status(500).send({message: 'Error al consultar los datos'});

			if(!projects) return res.status(404).send({message: 'No se han encontrado los proyectos'});

			return res.status(200).send({projects});
		});
	},


	//Actualizar un proyecto
	updateProject: function(req, res) {
		var projectId = req.params.id;

		//para actualizar el proyecto se recoge todos los datos
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new: true}, (err, projectUpdate) => {
			if(err) return res.status(500).send({message: 'Error al actualizar'});

			if(!projectUpdate) return res.status(404).send({message: 'No se han encontrado el proyecto'});

			return res.status(200).send({project: projectUpdate});
		});
	},


	//Borrar un proyecto
	deleteProject: function(req, res) {
		//vamos a tomar un valor por url para hacer una consulta
		var projectId = req.params.id;

		//si no funciona delete se puede usar findByIdAndRemove
		Project.findByIdAndDelete(projectId, (err, projectRemoved) => {
			//si da error
			if(err) return res.status(500).send({message: 'Error al borrar'});

			//en el caso de que no encuentre nada
			if(!projectRemoved) return res.status(404).send({message: 'No se ha encontrado el proyecto'});

			//si todo esta correcto
			return res.status(200).send({project: projectRemoved});
		})
	},


	//Subir un archivo
	uploadImage: function(req, res) {
		var projectId = req.params.id;
		var fileName = 'Imagen no subida...';

		if(req.files) {
			//recogo la ruta de la imagen
			var filePath = req.files.image.path;

			//recorto la ruta de la imagen para obtener el nombre, split divide un string
			var fileSplit = filePath.split('\\');

			//reasigno el valor de fileName
			var fileName = fileSplit[1];

			//sacar la extención del archivo
			var extSplit = fileName.split('\.');
			var fileExt = extSplit[1].toLowerCase();

			//comprobamos si es una extención valida de imagen
			if(fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
				//actualizo el campo image de la BD
				Project.findByIdAndUpdate(projectId, {image: fileName}, {new: true}, (err, projectUpdated) => {
					//si da error
					if(err) return res.status(500).send({message: 'La imagen no se ha subido'});

					//en el caso de que no encuentre nada
					if(!projectUpdated) return res.status(404).send({message: 'No se ha encontrado el proyecto y no subió la imagen'});

					//si todo esta bien
					return res.status(200).send({project: projectUpdated});
				});
			} else {
				//en el caso de que no sea una extención valida lo borro de mi carpeta uploads primero importo arriba fs
				fs.unlink(filePath, (err) => {
					return res.status(500).send({message: 'La extención no es valida'});
				});
			}	
		} else {
			return res.status(500).send({message: fileName});
		}
	},


	//devolver una imagen
	getImage: function(req, res) {
		//recibir el nombre de la imagen
		var file = req.params.image;

		//ubicar el archivo
		var pathFile = './uploads/'+file;

		//si existe el archivo
		fs.exists(pathFile, (exist) => {
			if(exist) {
				return res.sendFile(path.resolve(pathFile));
			} else {
				return res.status(404).send({message: 'No existe el archivo'});
			}
		});
		//para buscar la ruta en el proyecto se importa arrina el objeto path
	}
}

module.exports = controller;