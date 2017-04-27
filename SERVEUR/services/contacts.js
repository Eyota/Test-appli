var db = require ('../db/request.js');


var timer ;
var alpha=1;

function applicationOn(socket){


	// setInterval permet de mettre en place un appel cyclique toutes les <x> millisecondes
    timer = setInterval(function(){

    	// on actualise la position de l'utilisateur
        	//var res1 = updatePos();
        	//socket.send(res1.localisation); // envoie des données sur la websocket
	socket.emit('localisation', 'Gimme your pos !');
	socket.onmessage = function(event){
		console.log(data);
	}

       /* // on récupère les messages
        var res2 = getMsgs();
        //socket.send(res2);// necessaire?

        //on récupère les contacts présent autour de l'utilisateur
        var res3 = getContactPos();
        //socket.send()*/

        alpha += 0.1;
      }, 100)




}

function applicationOff(socket){

	// supprimer l'appel cyclique désigné par timer
    clearInterval(timer);

}

function setContactList(req, res){
	var contactsString = req.body.contactsString;
	var num = req.body.num;
	var contacts = JSON.parse(contactsString);
	console.log(contacts);
	var len = contacts.length
	for (i=0; i<len; i++){
		var contactNum = contacts[i].phoneNumbers[0];
		db.setContactList(num, contactNum, function(error,data){
			if (error == null){
				console.log(data);
			}
			else{
				console.log(error);
				res.status(500).send(error);
			}
		})
	}
}


// cette fonction actualise les contacts présent à la fois dans la base de données et dans les contacts du tel
function getContactNum(req, res){
	var num = req.params.num;
	    db.getUser(num,function(error,data){
	        if (error == null){
	            console.log(data);
		    res.status(200).json(data);
	        }
	        else{
	            console.log(error);
	            res.status(500).send(error);
	        }
	    })
}



function updatePos(req, res){
	var num = req.params.num;
    db.setLocalisation(num, function(error,data){
        if (error == null){
            console.log(data);
	    res.status(200).json({data})
        }
        else{
            console.log(error);
            res.status(500).send(error);
        }
    })
	return {localisation: localisation}

}

// cette fonction renvoie les contacts retournés par getContactNum qui sont dans les X km autour de l'utilisateur
function getContactPos(req, res){
	var num = req.params.num;
     	db.getLocalisation(num, function(error,data){
         if (error == null){
             console.log(data);
	     res.status(200).json({data})
         }
         else{
             console.log(error);
             res.status(500).send(error);
         }
     })
}







function getMsgs(req, res){
	var numUtilisateur = req.params.num;
	    db.getMessage(numUtilisateur, function(error,data){
	        if (error == null){
	            console.log(data);
	            //res.status(200).json({
	            //  emetteur : data.emetteur //,
	            //  type : data.type,
	            //  dateenvoi : data.dateenvoi,
	            //  contenu : data.contenus
	            //})
		   res.status(200).json({data})
	        }
	        else{
	            console.log(error);
	            res.status(500).send(error);
	        }
	    })
}


function createMsg(req, res){
	console.log('envoi message')
	console.log(req.body)
	console.log(req.body.contenu)
	res.status(200).send('ok')
	/*
	var num = req.body.num
	var type = 'text'
	var lat = req.body.latitude
	var long = req.body.longitude
	var contenu = req.body.contenu

	db.setMessage(num, lat, long, type, contenu, function(error,data){
        	if (error == null){
            		console.log(data);
	    		res.status(200).json({data})
        	}
        	else{
            		console.log(error);
            		res.status(500).send(error);
        	}
    })*/
}

module.exports = {
			setContactList,
			getContactNum,
			getContactPos,
			updatePos,
			getMsgs,
			createMsg

	}
