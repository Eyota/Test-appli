// envoi du message sur le serveur
$('#createMsg').click( function (res) {
    //res.render('../views/index', {});
    //window.location = "index.html";
    console.log('Envoi d un message');

    $.ajax({
        type : "POST",
        url : '/msg/',
        dataType : "html",
        contentType : 'application/x-www-form-urlencoded',
        data : $(this).serialize(),
        success : function() {
            alert('Message bien envoyé');
        }
  //       error : function() {
  //       	alert('Ne marche pas');
		// }
    });
});