// envoi du message sur le serveur
$('#createMsg').click( function (res) {
    //res.render('../views/index', {});
    //window.location = "index.html";
    var $this = $(this);

    var mesg = $('#msg').val();

    console.log('Envoi d un message');
    //alert(mesg);
    //alert('je vais envoyer un message');
    $.ajax({
        type : "POST",
        url : 'http://vps255789.ovh.net:8080/api/msg/',
        dataType : "json",
        //contentType : 'application/x-www-form-urlencoded',
        data: {contenu: JSON.stringify(mesg), num: JSON.stringify(0641953523)},
        //data : mesg,
        success : function() {
            alert('Message bien envoyé');
        },
        error : function() {
        	alert('Ne marche pas');
		}
    });
});