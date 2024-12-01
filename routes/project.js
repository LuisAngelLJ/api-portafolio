'use strict'

var express = require('express');
// modelo
var ProjectController = require('../controllers/project');
//importar las rutas de express
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './uploads'});

//crear ruta de tipo get que use el controlador home y la función home
router.get('/home', ProjectController.home);
router.post('/save', ProjectController.saveProject);
router.get('/project/:id?', ProjectController.getProject);//con la ? el parametro es opcional
router.get('/projects', ProjectController.getProjects);
router.put('/project/:id', ProjectController.updateProject);
router.delete('/project/:id', ProjectController.deleteProject);
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
//ruta para devolver una imagen
router.get('/get-image/:image', ProjectController.getImage);


//exportar el archivo
module.exports = router;