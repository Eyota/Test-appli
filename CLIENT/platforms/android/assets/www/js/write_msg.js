var Latitude = undefined;
var Longitude = undefined;

// // Get geo coordinates

// function getMapLocation() {

//     console.log("Récupération des coordonnées de géolocalisation");

//     navigator.geolocation.getCurrentPosition
//     (onMapSuccess, onMapError, { enableHighAccuracy: true });
// }

// // Success callback for get geo coordinates

// var onMapSuccess = function (position) {

//     Latitude = position.coords.latitude;
//     Longitude = position.coords.longitude;

//     console.log('latitude:'+ Latitude + '\n'+ 'longitude:' + Longitude);

//     //google.maps.event.addDomListener(window, 'load', getMap(Latitude, Longitude));

// }

// function onMapError(error) {
//     console.log('code: ' + error.code + '\n' +
//         'message: ' + error.message + '\n');
// }

// envoi du message sur le serveur
$('#createMsg').click( function (res) {

	alert("icic");

	var onSuccess = function(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude)
    }

    function onError(error) {
	    alert('code: ' + error.code + '\n' +
	        'message: ' + error.message + '\n');
	}

	navigator.geolocation.getCurrentPosition
    (onSuccess, onError, { enableHighAccuracy: true });

	alert('2)latitude:'+ Latitude + '\n'+ 'longitude:' + Longitude);

    var $this = $(this);

    var mesg = $('#msg').val();

    console.log("Envoi d'un message");

    $.ajax({
        type : "POST",
        url : 'http://vps255789.ovh.net:8080/api/msg/',
        dataType : "json",
        //contentType : 'application/x-www-form-urlencoded',
        data: {contenu: JSON.stringify(mesg),
        	num: JSON.stringify(window.localStorage.getItem('UserPhoneNumber')),
        	latitude: JSON.stringify(45.18487515),
        	longitude: JSON.stringify(5.71864032),
        	},
        success : function() {
            alert('Message bien envoyé');
        },
        error : function() {
        	alert("Le message n'a pas pu être envoyé.");
		}
    });
});