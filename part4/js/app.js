const FOUR_SQUARE_CLIENT_ID = 'VGRAORO20ED3QYD0XIICZ5YFSWKAQBNMV1Y3CXD1PUQ2TTW5';
const FOUR_SQUARE_URL = 'https://api.foursquare.com/v2/venues';
const FOUR_SQUARE_SECRET = 'NHJCKVBR12DGT3M2CKRS4DX53XTBUIOIW05ULFDDKLPEGMZC'
const initialLocations = [
    {title: 'Ho Chi Minh Mausoleum', location: {lat: 21.0313647, lng: 105.8371412}},
    {title: 'Temple Of Literature', location: {lat: 21.0296114, lng: 105.8358889}},
    {title: 'Hanoi University of Science and Technology', location: {lat: 21.0046184, lng: 105.8390342}},
    {title: 'Ngoc Son Temple', location: {lat: 21.0250183, lng: 105.8445133}},
];


function getLocationDetail(marker) {
    $.getJSON(FOUR_SQUARE_URL + '/query', {
        ll: marker.position.lat() + ',' + marker.position.lng(),
        client_id: FOUR_SQUARE_CLIENT_ID,
        client_secret: FOUR_SQUARE_SECRET,
        query: marker.title,
        v: '20180323',
        limit: 1,
    }, function(query) {
        console.log(query);
        if (query.meta.code !== 200 || query.response.venues.length == 0) {
            return {result: false};
        }

        const locationId = res.response.venues[0].id;
        $.getJSON(FOUR_SQUARE_URL + '/detail', {
            id: locationId,
            client_id: FOUR_SQUARE_CLIENT_ID,
            client_secret: FOUR_SQUARE_SECRET,
            v: '20180323',
        }, function(detail) {
            console.log(detail)
        });
    });
}

let map, bounds;

const ViewModel = function() {
    // Use self to reference to ViewModel
    const self = this;

    // Text binding to input to find location
    this.findCategory = ko.observable('');
    this.findLocation = {},

    // Hold all markers of map
    this.markers = [];

    // Show info window for a marker
    this.showInfoWindow = function (marker, infoWindow) {
        // Check if marker is opened
        if (marker !== infoWindow.marker) {
            infoWindow.marker = marker;

            console.log(marker);

            infoWindow.setContent('<div>' + marker.title + '</div>');
            getLocationDetail(marker);
            infoWindow.open(map, marker);

        }
    };

    // Init map
    this.initMap = function() {
        // Create new app instance
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 21.022736, lng: 105.8019441},
            zoom: 13,
        });
        // Set info window for app
        self.largeInfoWindow = new google.maps.InfoWindow();
        self.placeService = new google.maps.places.PlacesService(self.map);
        self.geocoder = new google.maps.Geocoder();

        const options = {
            // bounds: defaultBounds,
            componentRestrictions: {country: 'vn'},
            types: ['address'],
            fields: ['geometry', 'place_id'],
        };

        const locationInput = new google.maps.places.Autocomplete(
            document.getElementById('findLocation'), options);

        locationInput.addListener('place_changed', function() {
            const place = locationInput.getPlace();
            // console.log(place, place.geometry)
            if (place && place.place_id) {
                self.findLocation = place;
            }
        });
        // // Create a bound map instance
        // bounds = new google.maps.LatLngBounds();
        //
        // // Add locations list
        // initialLocations.forEach(function(lc, index) {
        //     // Create a new marker
        //     const marker = new google.maps.Marker({
        //         map: map,
        //         position: lc.location,
        //         title: lc.title,
        //         animation: google.maps.Animation.BOUNCE,
        //         id: index,
        //     });
        //
        //     // Show marker on map
        //     bounds.extend(marker.position);
        //     self.markers.push(marker);
        //     marker.addListener('click', function () {
        //         self.showInfoWindow(marker, self.largeInfoWindow);
        //     });
        //     setTimeout(function() {
        //         marker.setAnimation(null);
        //     }, 1500);
        // });
        // // Set map scale to fit our markers
        // map.fitBounds(bounds);
    };


    this.createMarker = function (location) {
        const marker = new google.maps.Marker({
            map: self.map,
            position: {
                lat: location.geometry.lat(),
                lng: location.geometry.lng(),
            },
            title: location.name,
            animation: google.maps.Animation.BOUNCE,
            id: location.id,
            locationInfo: location,
        });

        // Show marker on map
        bounds.extend(marker.position);
        self.markers.push(marker);
        marker.addListener('click', function () {
            self.showInfoWindow(marker, self.largeInfoWindow);
        });
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1500);
    };

    this.searchLocations = function () {
        console.log(self.findCategory(), self.findLocation)
        const lat = self.findLocation.geometry.location.lat();
        const lng = self.findLocation.geometry.location.lng();
        const location = new google.maps.LatLng({lat: lat, lng: lng});

        self.placeService.nearbySearch({
            location: location,
            radius: 1000,
            type: self.findCategory(),
        }, function(res) {
            console.log(res);
        })
    };

    this.filteredLocations = ko.computed(function () {
        return self.markers.filter(function(marker) {
            if (marker.title.toLowerCase().includes(self.filterText().toLowerCase())) {
                marker.setVisible(true);
                return true;
            }
            marker.setVisible(false);
            return false;
        })
    });

    this.initMap();
};

mapError = function googleError() {
    window.alert('Please refresh and try again. Google Maps did not load!');
};

function initApp() {
    ko.applyBindings(new ViewModel());
}

$(document).ready(function(){
    $('select').formSelect();
});