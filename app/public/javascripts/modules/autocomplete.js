function autocomplete(input, latInput, lngInput) {
  if (!input) {
    return;
  }

  const dropdown = new google.maps.places.Autocomplete(input); // eslint-disable-line

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  // prevent submiting if someone click enter in address field
  input.on('keydown', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}

export default autocomplete;