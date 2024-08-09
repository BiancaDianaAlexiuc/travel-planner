"use client";

import { useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const MapComponent = () => {
  //From the video
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const [selectedPlace, setSelectedPlace]: any = useState(null);
  const [searchLngLat, setSearchLngLat]: any = useState(null);
  const [currentLocation, setCurrentLocation]: any = useState(null);
  const autocompleteRef: any = useRef(null);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
        const route = response.routes[0].legs[0];
        setTravelTime(route.duration.text);
      } else {
        console.error("Directions request failed due to " + response.status);
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

  // on map load
  const onMapLoad = (map: google.maps.Map) => {
    handleGetLocation();
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
        className="w-full"
      >
        <input
          type="text"
          className="appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-white focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
          placeholder="Search for a location"
        />
      </Autocomplete>
      <span className="icon-[carbon--edit-off]">here</span>

      {/* map component  */}
      <GoogleMap
        zoom={currentLocation || selectedPlace ? 18 : 12}
        center={currentLocation || searchLngLat || center}
        mapContainerClassName="map"
        mapContainerStyle={{
          width: "1000px",
          height: "1000px",
          margin: "auto",
        }}
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
