"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

//add search by location with geolocation
//add background image of chase atm
//add "partnered with chase bank" text


function Map() {
    const [address, setCity] = useState('');
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
    const mapRef = React.useRef<HTMLDivElement>(null); 
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);  

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                version: "weekly",
                libraries: ["places"]
            });

            const { Map, InfoWindow} = await loader.importLibrary('maps');

            const position = {
                lat: 37.334665328,
                lng: -121.875329832
            }
            const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 10,
                mapId: 'SCHOOL_TEST_MAP'
            };

            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
            const gInfoWindow = new InfoWindow({ content: '' });

            setMap(map);
            setInfoWindow(gInfoWindow);
        }
        initMap();
    }, []);

    const clearMarkers = () => {
        markers.forEach(marker => marker.setMap(null)); 
        setMarkers([]); 
    };

    const getUserLocationAndSearch = () => {
        if (!map) return;
        clearMarkers();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position: GeolocationPosition) => {
                    const userPosition = {
                        lat: position.coords.latitude as google.maps.LatLngLiteral['lat'],
                        lng: position.coords.longitude as google.maps.LatLngLiteral['lng'],
                    };
                    map.setCenter(userPosition);
                    map.setZoom(13);

                    const service = new google.maps.places.PlacesService(map);
                    service.textSearch({
                        location: userPosition,
                        radius: 10000,
                        query: 'Chase ATM',
                    }, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                            results.forEach(createMarker);
                        }
                    });
                },
                (error: GeolocationPositionError) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleLocationSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        clearMarkers();
        if (!map || !address) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const cityLocation = results[0].geometry.location;
                map.setCenter(cityLocation);
                map.setZoom(13);

                const service = new google.maps.places.PlacesService(map);
                service.textSearch({
                    location: cityLocation,
                    radius: 10000,
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

        markers.push(marker);
        setMarkers(markers);

        const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`
        });

        marker.addListener('click', () => {
            infoWindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });
    };

    return (
        <div>
            <form style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: '20px' }}>
                    <input 
                        style={{ marginRight: '8px',marginTop: '8px', border: '1px solid black', padding: '10px', borderRadius: '10px', width: '250px' }}
                        type="text"
                        placeholder="Enter address or city name"
                        value={address}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button 
                        style={{
                            backgroundColor: '#E1090A', border: 'none', color: 'white', padding: '10px 20px',
                            borderRadius: '20px', cursor: 'pointer', marginRight: '8px', marginTop: '10px',marginBottom: '10px'
                        }}
                        type="button" 
                        onClick={handleLocationSearch}>Search</button>
                    <button 
                        style={{
                            backgroundColor: '#005EB8', border: 'none', color: 'white', padding: '10px 20px',
                            borderRadius: '20px', cursor: 'pointer', marginTop: '10px',marginBottom: '10px'
                        }}
                        type="button" 
                        onClick={getUserLocationAndSearch}>Use My Location</button>
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginBottom: '20px' }}>
                <div className='map-container' ref={mapRef} style={{ height: "85vh", width: "90%", maxWidth: '90%' }}></div>
            </div>
        </div>
    );
}

export default Map;