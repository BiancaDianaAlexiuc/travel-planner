"use client";

import { useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const MapComponent = () => {
  const [selectedPlace, setSelectedPlace]: any = useState(null);
  const [searchLngLat, setSearchLngLat]: any = useState(null);
  const [currentLocation, setCurrentLocation]: any = useState(null);
  const autocompleteRef: any = useRef(null);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
        const route = response.routes[0].legs[0];
        setTravelTime(route.duration.text);
      } else {
        console.error('Directions request failed due to ' + response.status);
      }
    }
  };

  // static lat and lng
  const center = { lat: 51.509865, lng: -0.118092 };

  // handle place change on search
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setSelectedPlace(place);
    setSearchLngLat({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setCurrentLocation(null);
  };

  // get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPlace(null);
          setSearchLngLat(null);
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // useEffect to get current location on mount
//   useEffect(() => {
//     handleGetLocation();
//   }, []);

  // on map load
  const onMapLoad = (map: any) => {
    handleGetLocation();
    // const controlDiv = document.createElement("div");
    // const controlUI = document.createElement("div");
    // // controlUI.innerHTML = "Get Location";
    // controlUI.style.backgroundColor = "white";
    // controlUI.style.color = "black";
    // controlUI.style.border = "2px solid #ccc";
    // controlUI.style.borderRadius = "3px";
    // controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    // controlUI.style.cursor = "pointer";
    // controlUI.style.marginBottom = "22px";
    // controlUI.style.textAlign = "center";
    // controlUI.style.width = "100%";
    // controlUI.style.padding = "8px 0";
    // // controlUI.addEventListener("click", handleGetLocationClick);
    // controlDiv.appendChild(controlUI);

    // map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {/* search component  */}
      <Autocomplete
        onLoad={(autocomplete) => {
          console.log("Autocomplete loaded:", autocomplete);
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={handlePlaceChanged}
        options={{ fields: ["address_components", "geometry", "name"] }}
      >
        <input type="text" placeholder="Search for a location" />
      </Autocomplete>

      {/* map component  */}
      <GoogleMap
        zoom={currentLocation || selectedPlace ? 18 : 12}
        center={currentLocation || searchLngLat || center}
        mapContainerClassName="map"
        mapContainerStyle={{ width: "1000px", height: "1000px", margin: "auto" }}
        onLoad={onMapLoad}
      >
        {selectedPlace && <Marker position={searchLngLat} />}
        {currentLocation && <Marker position={currentLocation} />}
        {searchLngLat && currentLocation && (
          <DirectionsService
            options={{
              destination: searchLngLat,
              origin: currentLocation,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
            }}
          />
        )}
      </GoogleMap>
      {travelTime && <p>Estimated travel time: {travelTime}</p>}
    </div>
  );
};

export default MapComponent;
