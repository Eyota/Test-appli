// envoi du message sur le serveur
$('#createMsg').click( function (res) {

    var $this = $(this);

    var mesg = $('#msg').val();

    console.log("Envoi d'un message");

    $.ajax({
        type : "POST",
        url : 'http://vps255789.ovh.net:8080/api/msg/',
        dataType : "json",
        //contentType : 'application/x-www-form-urlencoded',
        data: {contenu: JSON.stringify(mesg), num: JSON.stringify(window.localStorage.getItem("UserPhoneNumber"))},
        success : function() {
            alert('Message bien envoyé');
        },
        error : function() {
        	alert("Le message n'a pas pu être envoyé.");
		}
    });
});