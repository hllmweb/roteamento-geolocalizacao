var addresses = [
    ['243, Dornacherstrasse', '26, Mattenstrasse'],
    ['48 av general de gaulle, saint louis', 'Gründenstraße 40, Muttenz'],
    ['50 ackerstrasse , Basel', 'holeestrasse 133, Basel'],
    ['71 avenue de Bâle , Saint-Louis ', 'Leonhardstr 6, Basel'],
    ['Ackerstrasse 44, Basel', 'Petersplatz 1, Basel'],
    ['Ackerstrasse 51, Basel', 'Maiengasse 51, Basel '],
    ['Aeussere Baselstr. 255, Riehen', 'zu den drei Linden 80, Basel'],
    ['Aeussere Baselstrasse 309, Riehen', 'Gotthelfplatz 1, Basel'],
    ['Ahornstrasse 20, Basel', 'Viaduktstrasse , Basel'],
    ['Albert Schweitzer Strasse 10, Basel', 'Kohlenberg 17, Basel'],
    ['alemannengasse 17, Basel', 'Centrahlbahnplatz, Basel'],
    ['Alemannengasse 23, Basel', 'Peter Merian-Weg 8, Basel'],
    ['Allmendstrasse 233, Basel', 'Universitätsspital Basel, Basel '],
    ['Allmendstrasse 4, Basel', 'Petersplatz 1, Basel'],
    ['Allschwilerstrasse 106, Basel', 'Centralbahnstrasse 10 , Basel'],
    ['Allschwilerstrasse 116, Basel', 'Spitalstrasse 8, Architektur Institut, Basel '],
    ['Allschwilerstrasse 116, Basel', 'Steinenvorstadt 55, Kino Pathè Küchlin, Basel'],
    ['Allschwilerstrasse 48, Basel', 'Schneidergasse 28, Basel'],
    ['Altrheinweg 52, Basel', 'Vogesenplatz 1, Basel '],
    ['Am Rheinpark 6, Weil am Rhein', 'J. J. Balmer-Str. 3, Basel'],
    ['Am Weiher 15, Binningen', 'Klingelbergstrasse 82, Basel '],
    ['Amerbachstrasse, , Basel', 'Peter Merian-Weg, Basel'],
    ['Amerikanerstrasse 16, Binningen', 'Petersplatz 1, Basel'],
    ['Amselweg 20, Reinach', 'Baselstrasse 33, Münchenstein'],
    ['An der Auhalde 15, Riehen', 'Zu den Dreilinden 95, Basel'],
    ['arnikastr. 22, Riehen', 'marktplatz, Basel'],
    ['Auf der Lyss 14, Basel', 'Grenzstrasse 15, Basel']
  ];
  
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;
  var bounds;
  
  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var basel = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom: 7,
      center: basel
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    bounds = new google.maps.LatLngBounds();
  }
  
  // delay between directions requests
  var delay = 100;
  
  function calcRoute(start, end, next) {
    console.log("calcRoute('" + start + "','" + end + "',next)");
    var request = {
      origin: start,
      destination: end,
      travelMode: 'BICYCLING'
    };
    directionsService.route(request,
      function(result, status) {
        if (status == 'OK') {
  
          directionsDisplay = new google.maps.DirectionsRenderer({
            suppressBicyclingLayer: true,
            suppressMarkers: true,
            preserveViewport: true // don't zoom to fit the route
          });
          directionsDisplay.setMap(map);
          directionsDisplay.setDirections(result);
          // combine the bounds of the responses
          bounds.union(result.routes[0].bounds);
          // zoom and center the map to show all the routes
          map.fitBounds(bounds);
        }
        // ====== Decode the error status ======
        else {
          console.log("status=" + status + " (start=" + start + ", end=" + end + ")");
          // === if we were sending the requests to fast, try this one again and increase the delay
          if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            nextAddress--;
            delay += 100;
            document.getElementById('delay').innerHTML = "delay between requests="+delay;
          } else {
            var reason = "Code " + status;
            var msg = 'start="' + start + ' end="' + end + '"" error=' + reason + '(delay=' + delay + 'ms)<br>';
            document.getElementById("messages").innerHTML += msg;
          }
        }
        next();
      });
  }
  
  initialize();
  /* addresses.forEach(function(v, i) {
    setTimeout(calcRoute(addresses[i][0], addresses[i][1]), 100);
  }); */
  // google.maps.event.addDomListener(window, "load", initialize);
  // ======= Global variable to remind us what to do next
  var nextAddress = 0;
  
  // ======= Function to call the next Geocode operation when the reply comes back
  
  function theNext() {
    if (nextAddress < addresses.length) {
      console.log('call calcRoute("' + addresses[nextAddress][0] + '","' + addresses[nextAddress][1] + ') delay=' + delay);
      setTimeout('calcRoute("' + addresses[nextAddress][0] + '","' + addresses[nextAddress][1] + '",theNext)', delay);
      nextAddress++;
    } else {
      // We're done. Show map bounds
      map.fitBounds(bounds);
    }
  }
  
  // ======= Call that function for the first time =======
  theNext();
  
  // This Javascript is based on code provided by the
  // Community Church Javascript Team
  // https://www.bisphamchurch.org.uk/   
  // https://econym.org.uk/gmap/
  