"use client";
import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map: React.FC = () => {
    const [city, setCity] = useState('');
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Ensure your API key is correctly referenced here
            version: "weekly",
            libraries: ["places"]
        });

        loader.load().then(() => {
            const mapDiv = document.getElementById("map") as HTMLElement;
            const gMap = new google.maps.Map(mapDiv, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });

            const gInfoWindow = new google.maps.InfoWindow({ content: '' });
            setMap(gMap);
            setInfoWindow(gInfoWindow);
        });
    }, []);

    const handleLocationSearch = () => {
        if (!map || !city) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: city }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const cityLocation = results[0].geometry.location;
                map.setCenter(cityLocation);
                map.setZoom(13); // Adjust zoom level for city view

                const service = new google.maps.places.PlacesService(map);
                service.textSearch({
                    location: cityLocation,
                    radius: 5000, // Search within 5km radius
                    query: 'Chase ATM',
                }, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        results.forEach(createMarker);
                    }
                });
            }
        });
    };

    const createMarker = (place: google.maps.places.PlaceResult) => {
        if (!map || !place.geometry?.location) return;

        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
        });

        google.maps.event.addListener(marker, 'click', () => {
            if (infoWindow) {
                infoWindow.setContent(place.name || '');
                infoWindow.open(map, marker);
            }
        });
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={handleLocationSearch}>Search</button>
            </div>
            <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
    );
}

export default Map;


/*
export default function AtmMap() {


    const mapRef = React.useRef<HTMLDivElement>(null);
   
    const fetchATMLocations = async (map: google.maps.Map) => {
            // Fetch ATM locations using Google Places API
            const service = new google.maps.places.PlacesService(map);
            const request = {
                location: map.getCenter(),
                radius: 5000, // 5km radius
                type: 'atm'
            };
        }


    useEffect(() => {

        const initMap = async () => {
            const loader = new Loader({
            apiKey: process.env.NEXT_NEXT_PUBLIC_MAPS_API_KEY, //
            version: "weekly",
            });
            
            const { Map } = await loader.importLibrary('maps');

            
            
            const position = {
                lat: 37.334665328,
                lng: -121.875329832
            }

            const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 10,
                mapId: 'SCHOOL_TEST_MAP' };

            
            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    

         } 
        initMap();  
    }, []);
    
    return <div className='h-[50vh]' ref={mapRef} style={{ height: "400px" }}></div>;

   
 } */