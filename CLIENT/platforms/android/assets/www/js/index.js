/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */






// var express = require('express');
// var path = require('path');
// var db = require('./db/request.js')
// var exp = express(); // creation du serveur
// var mustacheExpress = require('mustache-express');
// var session = require('express-session')

// var server = require('http').createServer(exp);
// var bodyParser = require('body-parser')  // envoie des paramètres en POST
// var io = require('socket.io')(server);

// var contact_router = require('./routes/contacts_ctrl');
// var contact_services = require('./services/contacts');

// exp.set('views', path.join( 'public/views'));
// exp.engine('mustache', mustacheExpress());
// exp.set('view engine', 'mustache');


// exp.use('/api/', contact_router);

// io.on('connect', function (socket){
//     console.log("Start connection");
//     contact_services.applicationOn(socket)

//     socket.on('disconnect', function(){
//         console.log("Stop animation")
//         contact_services.applicationOff(socket)
//     })
// })

//var map = require('../../services/maps.js');


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

        $(document).bind("volumeupbutton", callbackFunction)
        $(document).bind("backbutton", onBackKeyDown)

        function  onBackKeyDown(e) {
            e.preventDefault ();
            //alert('Back  Button  is  Pressed!');
            window.location = "index.html";
        }

        function  callbackFunction () {
            alert('Volume  Up  Button  is  pressed!');
        }

        $('#return').click(function(){
            window.location = "index.html";
        });

        $('#sendMsg').click(function(){
            window.location = "sendMessage.html";
        });

        $('#getMsg').click(function(){
            window.location = "receivedMessages.html";
        });

        $('#getContact').click(function(){

            var options = new ContactFindOptions();
            //options.filter="Mathurin";
<<<<<<< HEAD
            options.hasPhoneNumber=true;
            options.multiple=true;
            options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];
            var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
=======
            //var fields = ["displayName", "name"];
            var fields = ["phoneNumbers"];
>>>>>>> b45b3aeb20c71e3170b5e3d81afad4a3da643ce2



            function onSuccess(contacts) {
                alert('Found ' + contacts.length + ' contacts.');

                // for (var i = 0; i < contacts.length; i++) {
                //     alert("Formatted: "  + contacts[i].name.formatted       + "\n" +
                //         "Family Name: "  + contacts[i].name.familyName      + "\n" +
                //         "Given Name: "   + contacts[i].name.givenName);
                // }

                $.ajax({
                    type: 'POST',
                    url: '/api/user/contacts',
                    data: {json: JSON.stringify(contacts)},
                    dataType: 'json',
                    success: function() {
                       alert("ok!")
                    },
                    error: function() {
                        alert("try again")
                    }

                });

                window.location = "listContacts.html";
            };

            function onError(contactError) {
                alert('onError!');
            };

            navigator.contacts.find(fields, onSuccess, onError, options);

            // exp.get('/contacts', function (req, res) {
            //     res.render('list_contacts', {contacts_data: contacts});
            // });


            });

        $('#getMap').click(function(){

            //getMapLocation();
            window.location = "getMap.html";
            //google.maps.event.addDomListener(window, 'load', getMapLocation);


            // document.addEventListener("online", onOnline, false);
            // document.addEventListener("resume", onResume, false);
            // loadMapsApi();

            // function onOnline() {
            //     loadMapsApi();
            // }

            // function onResume() {
            //     loadMapsApi();
            // }

            // function loadMapsApi() {
            //     // if (navigator.connection.type === Connection.NONE || (global.google !== undefined && global.google.maps)) {
            //     //     return;
            //     // }

            //     //TODO: Add your own Google maps API key to the URL below.
            //     $.getScript('https://maps.googleapis.com/maps/api/js?sensor=true&callback=onMapsApiLoaded&key=AIzaSyC6O0j1Cvo3VUU-ye0tnbe9QznskTeik08');
            // }

            // window.onMapsApiLoaded = function () {
            //     // Maps API loaded and ready to be used.
            //     var map = new google.maps.Map(document.getElementById("map"), {
            //         zoom: 8,
            //         center: new google.maps.LatLng(-34.397, 150.644)
            //     });
            // };


            //window.location = "getMap.html";
        });



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
