var Latitude = undefined;
var Longitude = undefined;

var tmp_storage = window.sessionStorage;
var spinner;

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

// Get geo coordinates

function getLocation() {

    //spinner = spinnerInit();
    //$('#spinner').after(spinner.spin().el);

    console.log("Récupération des coordonnées de géolocalisation");

    navigator.geolocation.getCurrentPosition
    (onSuccess, onError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    

    console.log('latitude:'+ Latitude + '\n'+ 'longitude:' + Longitude);
    
    tmp_storage.setItem("Latitude", Latitude);
    tmp_storage.setItem("Longitude", Longitude);


    //$('#spinner').after(spinner.stop().el);


}

function getMapLocation() {

    //spinner = spinnerInit();
    //$('#spinner').after(spinner.spin().el);

    console.log("Récupération des coordonnées de géolocalisation");

    navigator.geolocation.getCurrentPosition
    (onMapSuccess, onError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onMapSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    console.log('latitude:'+ Latitude + '\n'+ 'longitude:' + Longitude);
    
    tmp_storage.setItem("Latitude", Latitude);
    tmp_storage.setItem("Longitude", Longitude);


    //$('#spinner').after(spinner.stop().el);

    google.maps.event.addDomListener(window, 'load', getMap(Latitude, Longitude));

}



// Get map by using coordinates

function getMap(latitude, longitude) {
    console.log('getMap \n latitude:'+ latitude + '\n'+ 'longitude:' + longitude)

    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map
    (document.getElementById("map_canvas"), mapOptions);


    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
    alert("carte créée");

}

// Success callback for watching your changing position

var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getMap(updatedLatitude, updatedLongitude);
    }
}

// Error callback

function onError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    //getLocation();
}

// Watch your changing position

function watchMapPosition() {
    console.log("Ecoute des coordonnées de géolocalisation");

    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}
