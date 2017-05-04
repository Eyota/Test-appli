var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');




        // TOTALITE CODE DE L'APPLICATION
        var serveur_on = true;
        try {
            var socket = io.connect("http://vps255789.ovh.net:8080");
        }
        catch(err) {
            var serveur_on = false;
            alert("L'application est en mode hors-ligne!");
            console.log(err.message);
        }
        

    	// socket.on('localisation', function(socket) {
    	// 	socket.emit('myLoc', 'This is my pos');
    	// })
        function spinnerInit() {
            var opts = {
              lines: 13 // The number of lines to draw
            , length: 28 // The length of each line
            , width: 14 // The line thickness
            , radius: 42 // The radius of the inner circle
            , scale: 1 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '50%' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
            }

            var spinner = new Spinner(opts);
            return spinner;

        }

        var spinner = spinnerInit();


        var Longitude = undefined;
        var Latitude = undefined;


        //mémoire locale: conservée après fermeture
        var storage = window.localStorage;

        //mémoire perdue après chaque redémarrage
        var tmp_storage = window.sessionStorage;




//---------- A l'OUVERTURE  DE L'APPLICATION

        ///envoi user phone number
    	if (storage.getItem('UserPhoneNumber') == null){
        	
            navigator.notification.prompt(
                'Et votre pseudo...',
                saveLocalpseudo,
                "Pseudi",
                ['Ok','Exit']
                );

            navigator.notification.prompt(
                'Bienvenue ! Veuillez entrer votre numéro de téléphone (en 06)',
                saveLocal,
                "Téléphone",
                ['Ok','Exit'],
                '0612345678'
                );
    	}
    	else{
    	   console.log("Numéro de téléphone de l'utilisateur déjà enregistré");
    	}

    	function saveLocal(results){
    	   console.log("Enregistrement en local du numéro de télphone de l'utilisateur");
    	   storage.setItem("UserPhoneNumber", results.input1);
    	   console.log("Ce numéro est " + storage.getItem("UserPhoneNumber"));
    	}
        function saveLocalpseudo(results){
           console.log("Enregistrement en local du pseudo de l'utilisateur");
           storage.setItem("Pseudo", results.input1);
           console.log("Ce pseudo est " + storage.getItem("Pseudo"));
        }


        /// recolte des contacts du telephone
        if (tmp_storage.getItem("nbrContacts") == null){

            $('#spinner').after(spinner.spin().el);

            // réaliser une seule fois à l'ouverture de l'application
            //-->envoi des contacts du telephone au serveur

            //Récupération des Contacts du téléphone
            var options = new ContactFindOptions();

            options.hasPhoneNumber=true;
            options.multiple=true;
            options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];

            var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];

            navigator.contacts.find(fields, onSuccess, onError, options);

        }
        else{
            console.log("Contacts déjà enregistrés");
        }



        // récupération localisation


        if (tmp_storage.getItem("Longitude")==undefined && tmp_storage.getItem("Latitude")==undefined){
            
            $('#spinner').after(spinner.spin().el);
            
            getLocation();

            if (serveur_on == true){
                ajaxPutLocalisation();
            }

            $('#spinner').after(spinner.stop().el);
        }
        else{
            console.log("Données de géolocalisation déjà enregistrées");
            console.log("lat=" + tmp_storage.getItem("Latitude")+ "long=" + tmp_storage.getItem("Longitude"));
            if (serveur_on == true){
                ajaxPutLocalisation();
                ajaxGetMessage();
            }
        }






    //----------SOCKET
        if (serveur_on == true){

            socket.on('connected', function(message){
                socket.emit('login', window.localStorage.getItem('UserPhoneNumber'))
            })

            // socket.on('message', function(message){
            //  //alert(message)
            // })

            socket.on('localisation', function(message){
                //alert(message)
                getLocation();
                //alert('socket localisation')
                ajaxPutLocalisation();
            })

            socket.on('getMessage', function(){
                ajaxGetMessage();
            })
        }
    	

//--------------GESTION DES REQUETES AJAX

        function ajaxPutLocalisation(){
            console.log("ajaxPutLocalisation");

            $.ajax({
                type : "PUT",
                url : 'http://vps255789.ovh.net:8080/api/user/position/' + storage.getItem("UserPhoneNumber"),
                dataType : "json",
                //contentType : 'application/x-www-form-urlencoded',
                data: {
                    num: JSON.stringify(window.localStorage.getItem('UserPhoneNumber')),
                    //Pour téléphone sylvain:
                    //latitude: "45.187700",
                    //longitude: "5.731296",
                    latitude: JSON.stringify(window.tmp_storage.getItem('Latitude')),
                    longitude: JSON.stringify(window.tmp_storage.getItem('Longitude')),
                    },
                success : function(data) {
                    console.log('success'+data.latitude);
                },
                error : function(data) {
                    console.log('error'+JSON.stringify(data.latitude));
                }
            });

        }

        

        function ajaxGetMessage(){
            console.log("ajaxGetMessage");

          $.ajax({
              type : "GET",
              url : 'http://vps255789.ovh.net:8080/api/msg/' + storage.getItem("UserPhoneNumber"),
              dataType : "json",
              success : function(data) {
                  navigator.notification.beep(1);
                  //alert('Message reçu');
                  console.log(data);
                  //console.log(data.data[0].contenu);
                  console.log(data.data.length);
                  console.log("Success: Récupération des messages");


                  var template = "<ul class='table-view'>  <li class='table-view-divider'>Messages Recus:</li>{{ #liste}}  <li class='table-view-cell media'>    <div class='media-body'> {{pseudo}}<p>{{ contenu }}</p> </div> </li>  {{ /liste }} </ul>"

                  var templateNull = "<ul class='table-view'>  <li class='table-view-divider'>Messages Reçus:</li> <li class='table-view-cell media'>  <div class='media-body'> Aucun message reçu </div> </li> </ul>"
                  
                  if (data.data.length != 0){
                      $('#dynamicListe').html(

                          Mustache.render(
                              template,
                              {liste: data.data}
                          )

                      );
                    }
                    else{

                        $('#dynamicListe').html(

                          Mustache.render(
                              templateNull,
                              {liste: data.data}
                          )

                      );

                     }
                },
                error : function(data){
                    console.log(data);
                    console.log("Erreur: Récupération messages");
                }
              });
        }

        function ajaxGetContacts(){
            console.log("debut ajaxGetContacts");

          $.ajax({
              type : "GET",
              url : 'http://vps255789.ovh.net:8080/api/user/contact/' + storage.getItem("UserPhoneNumber"),
              dataType : "json",
              //contentType : 'application/x-www-form-urlencoded',
              success : function(data) {
                  navigator.notification.beep(1);

                  console.log("Success: Récupération des contacts");
                  //alert('Message reçu');
                  console.log(data[0]);
                  //console.log(data.data[0].contenu);
                  console.log(data.length);

                  tmp_storage.setItem("nbrContactsBD",data.length);


                  for (var i = 0; i < data.length; i++){

                    tmp_storage.setItem("Contacts" + i, JSON.stringify(data[i].nom).replace(/"/g, ''));
                    tmp_storage.setItem("Contacts" + i + "tel", data[i].idcontact);
                    console.log(tmp_storage.getItem("Contacts" + i) + tmp_storage.getItem("Contacts" + i + "tel"));
                  }
                  

                  //window.location = "listContacts.html";


                  // //var template = $("#liste-message").html();
                  // var template = "<ul> {{ #liste}} <li> {{emetteur}}: {{contenu}} </li> {{ /liste }} </ul>";
                  // var template2 = "<li><a class='fonction' href='#' data-name='{{ emetteur }}'>{{ contenu }}</a></li>";
                  // var template3 = "<ul class='table-view'><li class='table-view-cell table-view-cell'>Messages reçus</li>{{#data}}<li class='table-view-cell'>{{emetteur}}: {{contenu}}</li>{{#data}}</ul>"
                  // var template4 = "<ul class='table-view'>  {{ #liste}}  <li class='table-view-cell media'>    <div class='media-body'> {{emetteur}}<p>{{ contenu }}</p> </div> </li>  {{ /liste }} </ul>"


                  // // var template = "<ul class='table-view'>
                  // // <li class='table-view-divider'>Contacts utilisant l'application</li>
                  // // {{ #liste}}
                  // // <li class='table-view-cell'> {{contact}} </li>
                  // // <li class='table-view-cell table-view-cell'>Item 2</li>
                  // // <li class='table-view-cell'>Item 3</li>
                  // // {{ /liste }}
                  // // </ul>"
                  // // $('#dynamicContact').html(
                  // //     // Mustache.render(
                  // //     //     template,
                  // //     //     {liste: [
                  // //     //     {contenu: data.data[0].contenu},
                  // //     //     {contenu: data.data[1].contenu}
                  // //     //     ]}
                  // //     // )
                  // //     Mustache.render(
                  // //         template4,
                  // //         {liste: data.data}
                  // //     )

                  // // );
                },
                error: function(data){
                    console.log(data);
                    console.log("Erreur: Récupération contacts");
                }
              });
        }


        function ajaxGetContactsPosition(){
            console.log("debut ajaxGetContactsPosition");

          $.ajax({
              type : "GET",
              url : 'http://vps255789.ovh.net:8080/api/user/contact/position/' + storage.getItem("UserPhoneNumber"),
              dataType : "json",
              //contentType : 'application/x-www-form-urlencoded',
              success : function(data) {
                  navigator.notification.beep(1);

                  console.log("Success: localisation des contacts");
                  //alert('Message reçu');
                  console.log(data);
                  //console.log(data.data[0].contenu);

                  console.log(data.length);
                  console.log(data.data.length);

                  tmp_storage.setItem("nbrContactsBDloc",data.data.length);
                  

                  for (var i = 0; i < data.length; i++){
                    tmp_storage.setItem("ContactsLat" + i, data.data[i].latitude);
                    tmp_storage.setItem("ContactsLon" + i, data.data[i].longitude);
                    console.log(tmp_storage.getItem("ContactsLat" + i));
                    console.log(tmp_storage.getItem("ContactsLon" + i));
                  }

                },
                error: function(data){
                    console.log(data);
                    console.log("Erreur: localisation des contacts");

                }
            });
        }



//--------------GESTION DES TOUCHES

        $(document).bind("volumeupbutton", callbackFunction)
        $(document).bind("backbutton", onBackKeyDown)

        function  onBackKeyDown(e) {
            e.preventDefault ();
            window.location = "index.html";
        }

        function  callbackFunction () {
            //alert('Volume  Up  Button  is  pressed!');
        }




//--------------GESTION DES BOUTONS
        $('#return').click( function (res) {
            window.location = "index.html";
        });
        $('#backHome').click( function (res) {
            window.location = "index.html";
        });


        $('#createMsg').click( function (res) {

            $('#spinner').after(spinner.spin().el);

            var $this = $(this);

            var mesg = $('#msg').val();

            console.log("Envoi d'un message");

            if (serveur_on == true){
                $.ajax({
                    type : "POST",
                    url : 'http://vps255789.ovh.net:8080/api/msg/',
                    dataType : "json",
                    //contentType : 'application/x-www-form-urlencoded',
                    data: {contenu: JSON.stringify(mesg),
                        num: JSON.stringify(window.localStorage.getItem('UserPhoneNumber')),
                        pseudo : JSON.stringify(window.localStorage.getItem('Pseudo')),
                        latitude: JSON.stringify(window.tmp_storage.getItem("Latitude")),
                        longitude: JSON.stringify(window.tmp_storage.getItem("Longitude")),
                        },
                    success : function() {
                        console.log('Message bien envoyé');
                        socket.emit('event', "I sent a message !")
                    },
                    error : function(data) {
                        console.log(data.latitude);
                        console.log(window.tmp_storage.getItem("Longitude"));
                        console.log("erreur dans envoi message");
                        socket.emit('event', "I sent a message !")
                    }
                });
            }

            $('#spinner').after(spinner.stop().el);
        });




        $('#getMsg').click(function(){

            $('#spinner').after(spinner.spin().el);

            console.log(storage.getItem("UserPhoneNumber"));
            if (serveur_on == true){
                ajaxGetMessage();
            }

            $('#spinner').after(spinner.stop().el);
        });


        $('#getContact').click(function(){

            if (serveur_on == true){
                ajaxGetContacts();
            }
            if (tmp_storage.getItem("nbrContactsBD") != undefined){
                window.location = "listContacts.html";
            }

        });

        $('#getMap').click(function(){
            if (serveur_on == true){
                ajaxGetContactsPosition();
            }
            if (tmp_storage.getItem("nbrContactsBDloc") != undefined){
                window.location = "getMap.html";
            }

        });





        ////////// FONCTIONS ANNEXE

        //Envoi des contacts du téléphone au serveur

        function onSuccess(contacts) {
            console.log('Found ' + contacts.length + ' contacts.');

            tmp_storage.setItem("nbrContacts", contacts.length);

            //$('#spinner').after(spinner.stop().el);
            // for (var i = 0; i < contacts.length; i++) {
            //     alert("Formatted: "  + contacts[i].name.formatted       + "\n" +
            //         "Family Name: "  + contacts[i].name.familyName      + "\n" +
            //         "Given Name: "   + contacts[i].name.givenName);
            // }

            // for (var i = 0; i < contacts.length; i++) {
            //     $.ajax({
            //         type : "POST",
            //         url : 'http://vps255789.ovh.net:8080/api/user/contact/',
            //         dataType : "json",
            //         //contentType : 'application/x-www-form-urlencoded',
            //         data: {
            //             NOM_COMPLET: JSON.stringify(contacts[i].name.formatted),
            //             PRENOM: JSON.stringify(contacts[i].name.givenName),
            //             NUM: JSON.stringify(contacts[i].name.phoneNumbers)
            //         },
            //         success : function() {
            //             alert('Contacts du téléphone correctement transféré au serveur');
            //         },
            //         error : function() {
            //             alert("Les contacts du téléphone n'ont pas pu être transféré au serveur");
            //         }
            //     });

            // }
            var erreur = 0;

            for (var i = 0; i < contacts.length; i++) {
                if (serveur_on == true){
                    $.ajax({
                        type : "POST",
                        url : 'http://vps255789.ovh.net:8080/api/user/contact/',
                        dataType : "json",
                        //contentType : 'application/x-www-form-urlencoded',
                        data: {
                            user: window.localStorage.getItem('UserPhoneNumber'),
                            contact: contacts[i].phoneNumbers[0]
                        },
                        success : function() {
                            console.log('Contacts du téléphone correctement transféré au serveur');
                        },
                        error : function() {
                            console.log("Les contacts du téléphone n'ont pas pu être transféré au serveur");
                            erreur = erreur+1;
                            //alert("erreur");
                        }
                    });

                }
                
            }
            if (erreur !=0){
                function onConfirm(buttonIndex) {
                    //alert('You selected button ' + buttonIndex);
                    //window.location = "index.html";
                }


                navigator.notification.confirm(
                    erreur + " contacts n'ont pas pu être envoyé! Souhaitez-vous réessayer?", // message
                     onConfirm,            // callback to invoke with index of button pressed
                    'Contacts non envoyé',           // title
                    ['Oui','Non']     // buttonLabels
                );

            }
            $('#spinner').after(spinner.stop().el);
            //window.location = "index.html";
        };



        function onError(contactError) {
            //alert('onError!');
            $('#spinner').after(spinner.stop().el);
        };




    },



    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },


};

app.initialize();
