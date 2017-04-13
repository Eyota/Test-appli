
var pgb = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').settings

var db = pgb(dbconfig)


//demande a la bas e de données si l'utilisateur au n°x a l'application
function getUser(num,callback){

}


// Pour actualiser la localisation de l'utilisateur
function setLocalisation(num, callback){

}


// Pour récupérer la localisation de l'utilisateur
function getLocalisation(num, callback){

}



// date inséré dans la requete avec la fonction now()
function setMessage(id, numEme, numDest, type, data, callback){

}


//reception des messages en attente pour l'utilisateur Dest
//supprimer les messages receptionnés!!!!
function getMessage(numDest, callback){

}


//delete message périmé
function deleteMessage(callback){

}