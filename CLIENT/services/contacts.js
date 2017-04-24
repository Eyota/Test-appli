var db = require ('../db/request.js');


var timer ;
var alpha=1;

function applicationOn(socket){

	// A l'ouvertrue de l'application on actualise les contacts possédant l'Appligator & qui sont dans les contacts

	var res = getContactNum();

	// setInterval permet de mettre en place un appel cyclique toutes les <x> millisecondes
    timer = setInterval(function(){

    	// on actualise la position de l'utilisateur
        var res1 = updatePos();
        socket.send(res1.localisation); // envoie des données sur la websocket
        
        // on récupère les messages
        var res2 = getMsgs();
        //socket.send(res2);// necessaire?

        //on récupère les contacts présent autour de l'utilisateur
        var res3 = getContactPos();
        //socket.send()

        alpha += 0.1;
      }, 100)




}

function applicationOff(socket){

	// supprimer l'appel cyclique désigné par timer
    clearInterval(timer);

}



// cette fonction actualise les contacts présent à la fois dans la base de données et dans les contacts du tel
function getContactNum(req, res){

}


// a faire avec le module de cordova
function updatePos(req, res){

	return {localisation: localisation}

}

// cette fonction renvoi les contacts retournés par getContactNum qui sont dans les X km autour de l'utilisateur
function getContactPos(req, res){

}







function getMsgs(req, res){

}


function createMsg(req, res){
	
}

module.exports = {


	}

