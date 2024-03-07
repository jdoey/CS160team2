"use client";
import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';




export default function Map() {


    const mapRef = React.useRef<HTMLDivElement>(null);
    /*
    const fetchATMLocations = async (map: google.maps.Map) => {
            // Fetch ATM locations using Google Places API
            const service = new google.maps.places.PlacesService(map);
            const request = {
                location: map.getCenter(),
                radius: 5000, // 5km radius
                type: 'atm'
            };
    */

    useEffect(() => {

        const initMap = async () => {
            const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, //api key in env file
            version: "weekly",
            });
            // Create the map
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
    }, []);
    return <div id="map" style={{ height: "400px" }}></div>;

    
 } 


