import axios from 'axios';
import { $ } from './bling';

let mapOptions, currentPosition;

function getPositionObject(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function getCurrentPosition(options) {
  if (!currentPosition) {
    currentPosition = await getPositionObject(options);
  }
  return {
    lat: currentPosition.coords.latitude,
    lng: currentPosition.coords.longitude,
  };
}

async function setMapOptions() {
  const center = await getCurrentPosition();
  mapOptions = {
    // center: { lat: 43.263, lng: -79.866 },
    center,
    zoom: 10
  };
}

async function loadPlaces(map, lat, lng) {
  if (!lat || !lng) {
    const position = await getCurrentPosition();
    lat = position.lat;
    lng = position.lng;
  }
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(response =>{
      const { data: places } = response;

      if (!places.length) {
        console.error('There are no places'); // eslint-disable-line 
        return;
      }

      // create a bounds
      const bounds = new google.maps.LatLngBounds();  // eslint-disable-line 

      const infoWindow = new google.maps.InfoWindow();  // eslint-disable-line 

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position);
        const marker = new google.maps.Marker({ map, position });  // eslint-disable-line 
        marker.place = place;
        return marker;
      });


      // when someone clicks on the marker show info window
      markers.forEach(marker => marker.addListener('click', function(){
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <img src="${'/uploads/'+this.place.photo || '/images/defaults/store.png'}" alt="${this.place.name}" />
            </a>
            <p>${this.place.name} - ${this.place.location.address}</p>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // zoom the map to fit all markers
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);


    });
}

async function makeMap(mapDiv) {
  // to prevent get location on another pages
  if (!mapDiv) {
    return;
  }

  if (!mapOptions) {
    await setMapOptions();
  }

  // make map
  const map = new google.maps.Map(mapDiv, mapOptions);  // eslint-disable-line 
  await loadPlaces(map);
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);  // eslint-disable-line 
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

export default makeMap;