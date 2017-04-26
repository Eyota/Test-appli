
var pgb = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').settings

var db = pgb(dbconfig)


//demande a la base de données si l'utilisateur au n°x a l'application
// Si la réponse est vide, l'utilisateur n'a pas l'app
function getUser(num,callback){
  var requete = `select numTel, nom from public.utilisateurs where numTel=${num}`
  console.log(requete);

  db.any(requete, null)
          .then(function (data)  {
              callback(null, data)
  })
          .catch(function(error)  {
              callback(error, null)
  })
}






function setContactList(numEmet, numContact, callback){ //---> OK !!! 

    var requete = `select numTel, nom from public.utilisateurs where numTel='${numContact}'`
    console.log(requete);
    db.any(requete, null)
	.then(function (data) {
		console.log(JSON.stringify(data));
		//Si une ligne est retournée, le contact est utilisateur : il faut insérer le couple utilisateur/contact dans la table connaissance s'il n'y est pas encore
		if(JSON.stringify(data) != '[]'){
			var requete2 = `select idContact from public.connaissances where idContact='${numContact}' and idClient='${numEmet}'`
			console.log(requete2);
			db.any(requete2, null)
				.then(function (data) {
					console.log(data);
					//Si le couple n'existe pas, on l'insère
					if(JSON.stringify(data) == '[]'){
						var requete3 = `insert into public.connaissances (idClient, idContact) values ('${numEmet}', '${numContact}')`
						console.log(requete3);
						db.none(requete3, null)
							.then(function(data){
								callback();
							})
					}
				})
				.then(function(data){
					callback(data, error);
				})
		}
	})
	.then(function(data){
		callback(data, error);
	})
	.catch(function(error) {
		callback(error, null)
	})
}


 





// Pour actualiser la localisation de l'utilisateur --> PostGis ?
function setLocalisation(num, lat, long, callback){
  var requete = `update utilisateurs set latitude=${lat}, longitude=${long} where numTel = ${num}`
  console.log(requete);

  db.none(requete, null).
            then(function (data) {
                callback();
            }).catch(function(error) {
        console.log(error) // devrait normalement remonter à la page web
    })
}


// Pour récupérer la localisation de l'utilisateur
//	=> A changer : passer une liste de contacts et récupérer les utilisateur à moins d'un km avec postgis TODO
function getLocalisation(num, callback){
  var requete = `select latitude, longitude from public.utilisateurs where numTel = ${num}`
  console.log(requete);

  db.any(requete, null)
          .then(function (data)  {
              callback(null, data)
  })
          .catch(function(error)  {
              callback(error, null)
  })
}







// date inséré dans la requete avec la fonction now()
function setMessage(numEme, numDest, type, data, callback){
  var requete = `insert into messages (emetteur, dateEnvoi, destinataire, type, contenu) values  (${numEme}, now(), ${numDest}, '${type}', ${data})`
  console.log(requete);

  db.none(requete, null).
            then(function (data) {
                callback();
            }).catch(function(error) {
        console.log(error) // devrait normalement remonter à la page web
    })
}


//reception des messages en attente pour l'utilisateur Dest
/*function getMessage(numDest, callback){
  var requete = "select m.emetteur, m.type, m.contenu, m.dateEnvoi from public.messages m, public.connaissances c where m.emetteur=c.utilisateur and c.contact=${numDest}"
  console.log(requete);

  db.any(requete, null)
          .then(function (data)  {
              callback(null, data)
  })
          .catch(function(error)  {
              callback(error, null)
  })
}*/



//reception des messages en attente pour l'utilisateur Dest
function getMessage(numDest, callback){
  var requete = `select emetteur, type, contenu, dateEnvoi from public.messages where destinataire=${numDest}`
  console.log(requete);

  db.any(requete, null)
          .then(function (data)  {
              callback(null, data)
  })
          .catch(function(error)  {
              callback(error, null)
  })
}



//delete message périmé
function deleteMessage(callback){
    var requete = `delete from messages where datediff(curdate(), dateEnvoi)>1`
    console.log(requete);

    db.none(requete, null).
              then(function (data) {
                  callback();
              }).catch(function(error) {
          console.log(error) // devrait normalement remonter à la page web
      })
}

module.exports = {
  getUser,
  setContactList,
  setLocalisation,
  getLocalisation,
  setMessage,
  getMessage,
  deleteMessage
};

