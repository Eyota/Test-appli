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

        //var socket = io.connect();

        //var mustache = require ('mustache');
        // var express = require('express');
        // var path = require('path');
        // var exp = express(); // creation du serveur
        // var mustacheExpress = require('mustache-express');
        // var session = require('express-session')

        // app.set('views', path.join( '../views'));
        // app.engine('mustache', mustacheExpress());
        // app.set('view engine', 'mustache');

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
            console.log("Contacts déjà enregistrées");
        }


        if (tmp_storage.getItem("Longitude")==undefined && tmp_storage.getItem("Latitude")==undefined){
            
            getLocation();
        }
        else{
            console.log("Données de géolocalisation déjà enregistrées");
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


        $('#sendMsg').click(function(){

            if (storage.getItem('UserPhoneNumber') == null){
                navigator.notification.prompt(
                    'Veuillez entrer votre numéro de téléphone (en 06)',
                    saveLocal,
                    "Téléphone",
                    ['Ok','Exit'],
                    '0612345678'
                    );
            }
            else{
                console.log("Numéro de téléphone de l'utilisateur déjà enregistré");
                window.location = "index.html";
            }

            function saveLocal(results){
                console.log("Enregistrement en local du numéro de télphone de l'utilisateur");
                storage.setItem("UserPhoneNumber", results.input1);
                console.log("Ce numéro est" + storage.getItem("UserPhoneNumber"));
                window.location = "index.html";
            }
        });


            /// dans la page sendMessage.html
            $('#createMsg').click( function (res) {

                alert("ici");

                alert('2)latitude:'+ tmp_storage.getItem("Latitude") + '\n'+ 'longitude:' + tmp_storage.getItem("Longitude"));
                var $this = $(this);

                var mesg = $('#msg').val();
                alert(mesg);


                console.log("Envoi d'un message");

                $.ajax({
                    type : "POST",
                    url : 'http://vps255789.ovh.net:8080/api/msg/',
                    dataType : "json",
                    //contentType : 'application/x-www-form-urlencoded',
                    data: {contenu: JSON.stringify(mesg),
                        num: JSON.stringify(window.localStorage.getItem('UserPhoneNumber')),
                        latitude: JSON.stringify(window.tmp_storage.getItem("Latitude")),
                        longitude: JSON.stringify(window.tmp_storage.getItem("Longitude")),
                        },
                    success : function() {
                        alert('Message bien envoyé');
                    },
                    error : function(data) {
                        console.log(data.latitude);

                        // function onConfirm(buttonIndex) {
                        //     alert('You selected button ' + buttonIndex);
                        // }

                        // navigator.notification.confirm(
                        //     "le message n'a pas pu être envoyé! Souhaitez-vous réessayer?", // message
                        //      onConfirm,            // callback to invoke with index of button pressed
                        //     'Message non envoyé',           // title
                        //     ['Oui','Non']     // buttonLabels
                        // );
                        alert("Le message n'a pas pu être envoyé.");
                    }
                });
            });




        $('#getMsg').click(function(){

            console.log(storage.getItem("UserPhoneNumber"));

            $.ajax({
                type : "GET",
                url : 'http://vps255789.ovh.net:8080/api/msg/' + storage.getItem("UserPhoneNumber"),
                dataType : "json",
                //contentType : 'application/x-www-form-urlencoded',
                success : function(data) {
                    navigator.notification.beep(1);
                    alert('Message reçu');
                    console.log(data);
                    console.log(data.data[0].contenu);
                    console.log(data.length);

                    //tmp_storage.setItem("Msg",data);

                    //var template = $("#liste-message").html();
                    var template = "<ul> {{ #liste}} <li> {{contenu}} </li> {{ /liste }} </ul>";
                    $('#dynamicListe').html(
                        Mustache.render(
                            template,
                            {liste: [
                            {contenu: data.data[0].contenu},
                            {contenu: data.data[1].contenu}
                            ]}
                        )

                    );

                    // var template = "{{contenu}} {{emetteur}}";
                    // //var html = Mustache.to_html(template, data.data[0]);
                    // var html = Mustache.render(template, data.data[0]);
                    // $('#dynamicListe').html(html);

                    
                },
                error : function() {
                    alert("Aucun message reçu.");
                }
                //window.location = "receivedMessages.html";
            });

            

        });


        $('#getContact').click(function(){

            var options = new ContactFindOptions();
            //options.filter="Mathurin";

            options.hasPhoneNumber=true;
            options.multiple=true;
            options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];
            var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
            //var fields = ["displayName", "name"];
            //var fields = ["phoneNumbers"];

    
            //navigator.contacts.find(fields, onSuccess, onError, options);

            // exp.get('/contacts', function (req, res) {
            //     res.render('list_contacts', {contacts_data: contacts});
            // });

            window.location = "listContacts.html";


        });

        $('#getMap').click(function(){
            window.location = "getMap.html";

        });

        $('#updateContacts').click(function(){
            console.log("updatecontacts");
            var options = new ContactFindOptions();

            options.hasPhoneNumber=true;
            options.multiple=true;
            options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];
            
            var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];

            navigator.contacts.find(fields, onSuccess, onError, options);
            window.location = "listContacts.html";
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
            if (erreur !=0){
                function onConfirm(buttonIndex) {
                    alert('You selected button ' + buttonIndex);
                    window.location = "index.html";
                }
                

                navigator.notification.confirm(
                    erreur + " contacts n'ont pas pu être envoyé! Souhaitez-vous réessayer?", // message
                     onConfirm,            // callback to invoke with index of button pressed
                    'Contacts non envoyé',           // title
                    ['Oui','Non']     // buttonLabels
                );

            }
            $('#spinner').after(spinner.stop().el);
            window.location = "index.html";
        };

        function onError(contactError) {
            alert('onError!');
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
    }
};

app.initialize();
