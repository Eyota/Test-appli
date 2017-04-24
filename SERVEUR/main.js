var express = require('express');
var path = require('path');
var app = express(); // creation du serveur
var server = require('http').createServer(app);
var bodyParser = require('body-parser')  // envoie des paramètres en POST
var io = require('socket.io')(server);
var service = require('../services/contacts')

var contact_router = require('./routes/contacts_ctrl');
var contact_services = require('./services/contacts');

/*app.use(bodyParser.urlencoded({     // pour gérer les URL-encoded bodies (envoie formulaire en POST)
  extended: true
}));*/ 

//app.set('views', path.join( 'public/views'));
//app.use(bodyParser.json) // permet de lire le json envoyé en POST depuis le client


app.use('/api/', contact_router);

io.on('connection', function (socket) {
  socket.emit('message', 'Vous �tes bien connect� !');
});

io.on('getMsg', function(num) {
  
});


 
// le repertoire public va contenir les
// fichiers statiques
//app.use(express.static('public'));

server.listen(8080); // démarrage du serveur sur le port 8080

console.log("Serveur démarré sur le port 8080");
