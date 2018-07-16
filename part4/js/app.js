// Location categories
const CATEGORIES = [
    {value: 'restaurant', name: 'Restaurant'},
    {value: 'cafe', name: 'Cafe'},
    {value: 'school', name: 'School'},
];

// Radius options from a location
const RADIUSES = [
    {value: 200, name: '200 m'},
    {value: 500, name: '500 m'},
    {value: 1000, name: '1 km'},
    {value: 2000, name: '2 km'},
];

// Create info for a location as a html string
function makeInfoPanel(location) {
    let html = '';
    if (location.photos && location.photos.length > 0) {
        html += '<img src="' + location.photos[0].getUrl({maxWidth: 200, maxHeight: 100}) + '" height="100">';
    }
    html += '<h5>' + location.name + '</h5>';
    html += '<p>Address: ' + location.vicinity + '</p>';

    if (location.rating) {
        html += '<p>Rating: ' + location.rating + '</p>';
    }

    return '<div class="info-window">' + html + '</div>';
}

// Main view model
const ViewModel = function() {
    // Use self to reference to ViewModel
    const self = this;

    this.CATEGORIES = CATEGORIES;
    this.RADIUSES = RADIUSES;

    // Text binding to input to find location
    this.findCategory = ko.observable(CATEGORIES[0].value);
    this.findRadius = ko.observable(RADIUSES[0].value);
    this.findLocation = {};

    // Text to filter locations by name
    this.filterText = ko.observable('');

    // Hold all markers of map
    this.markers = ko.observableArray([]);
    this.isLoadingLocations = ko.observable(false);

    // Show info window for a marker
    this.showInfoWindow = function (marker, infoWindow) {
        // Check if marker is opened
        if (marker !== infoWindow.marker) {

            infoWindow.setContent(makeInfoPanel(marker.locationInfo));

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

        // Set google map api and services
        self.largeInfoWindow = new google.maps.InfoWindow();
        self.placeService = new google.maps.places.PlacesService(self.map);
        self.geocoder = new google.maps.Geocoder();

        // Init autocomplete input
        const locationInput = new google.maps.places.Autocomplete(
            document.getElementById('findLocation'),
            {
                componentRestrictions: {country: 'vn'},
                types: ['address'],
                fields: ['geometry', 'place_id'],
            }
        );

        // Set event for autocomplete input to assign location's information
        locationInput.addListener('place_changed', function() {
            const place = locationInput.getPlace();
            if (place && place.place_id) {
                self.findLocation = place;
            }
        });
    };


    // Create marker
    this.createMarker = function (location) {
        const marker = new google.maps.Marker({
            map: self.map,
            position: {
                lat: location.geometry.location.lat(),
                lng: location.geometry.location.lng(),
            },
            title: location.name,
            animation: google.maps.Animation.BOUNCE,
            id: location.id,
            locationInfo: location,
        });

        // Show marker on map
        self.bounds.extend(marker.position);
        self.markers().push(marker);
        marker.addListener('click', function () {
            self.showInfoWindow(marker, self.largeInfoWindow);
        });
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1000);
    };

    // Perform searching to retrieve nearby places and show it to map
    this.searchLocations = function () {
        // Make sure use select a valid location
        if (!self.findLocation || !self.findLocation.geometry) {
            return window.alert('Please select a valid location');
        }
        const lat = self.findLocation.geometry.location.lat();
        const lng = self.findLocation.geometry.location.lng();
        const location = new google.maps.LatLng({lat: lat, lng: lng});

        self.isLoadingLocations(true);
        // Get nearby places
        self.placeService.nearbySearch({
            location: location,
            radius: self.findRadius(),
            type: self.findCategory(),
        }, function(locations) {
            // Clear markers
            self.markers().forEach(function (marker) {
                marker.setMap(null);
            });
            self.markers([]);

            // Add new markers
            self.bounds = new google.maps.LatLngBounds();
            locations.forEach(function (location) {
                self.createMarker(location);
            });
            self.map.fitBounds(self.bounds);
            self.filterText('');
            self.isLoadingLocations(false);

        })
    };

    // Set current place
    this.changeCurrentPlace = function (marker) {
        self.showInfoWindow(marker, self.largeInfoWindow);
    };

    // Location filter by name
    this.filteredLocations = ko.computed(function () {
        if (self.isLoadingLocations()) return [];

        // Filter location, setVisible for each one
        return self.markers().filter(function(marker) {
            if (marker.title.toLowerCase().includes(self.filterText().toLowerCase())) {
                marker.setVisible(true);
                return true;
            }
            marker.setVisible(false);
            return false;
        })
    });

    // Only show filter input when searching completed
    this.isShowFilterInput = ko.computed(function () {
        return !self.isLoadingLocations() && self.markers().length > 0
    });
    this.initMap();
};

// Error handler for map js
mapError = function googleError() {
    window.alert('Please refresh and try again. Google Maps did not load!');
};

// Function to initialize app
function initApp() {
    ko.applyBindings(new ViewModel());
}


// Materialize stuffs
$(document).ready(function(){
    $('select').formSelect();
});

$(document).ready(function(){
    $('.side-nav').sidenav();
});