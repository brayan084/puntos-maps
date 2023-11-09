import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface MapaProps {
    lugarSeleccionado: { lat: number, lng: number } | null;
}

const MapContainer: React.FC<MapaProps> = ({ lugarSeleccionado }) => {

    const [puntosInteres, setPuntosInteres] = useState<{ lat: number; lng: number }[]>([]);;
    const [center, setCenter] = useState<{ lat: number, lng: number }>({ lat: -34.61, lng: -58.38 });
    const [marcadores, setMarcadores] = useState<{ id: number, lat: number, lng: number }[]>([]);

    console.log(puntosInteres)
    console.log(marcadores)


    useEffect(() => {
        if (lugarSeleccionado && lugarSeleccionado.lat === 0 && lugarSeleccionado.lng === 0) {
            // No hago nada jejeje
        } else if (lugarSeleccionado) {
            setPuntosInteres([lugarSeleccionado]);
            setCenter(lugarSeleccionado);
        }
    }, [lugarSeleccionado]);

    const handleMarkerClick = (markerId: number) => {
        setMarcadores(marcadores => marcadores.filter(marker => marker.id !== markerId));
    }

    const handleMapClick = (event: google.maps.MapMouseEvent) => {

        if (event.latLng) {

            const newMarker = {
                id: Date.now(),
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            setMarcadores(marcadores => [...marcadores, newMarker]);
        }
    }

    // styles del mapa como por ejemplo las marcas de restaurantes
    const mapStyles: google.maps.MapTypeStyle[] = [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "transit",
            elementType: "labels",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "landscape",
            elementType: "labels",
            stylers: [
                {
                    visibility: "on",
                },
            ],
        },
        {
            featureType: "administrative",
            elementType: "labels",
            stylers: [
                {
                    visibility: "on",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "labels",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [
                {
                    visibility: "on",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "labels.text",
            stylers: [
                {
                    visibility: "on",
                },
            ],
        },
    ];


    // styles del contenerdor del mapa
    const styles = {
        height: "75vh",
        width: "70%",
        margin: "auto",
        marginTop: "50px",
    }

    return  (
        <GoogleMap
            mapContainerStyle={styles}
            center={center}
            zoom={13}
            onClick={handleMapClick}
            options={{
                // disableDefaultUI: true,
                styles: mapStyles,
            }}
        >
            {marcadores.map(marker => (
                <Marker
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => handleMarkerClick(marker.id)}
                />
            ))}
        </GoogleMap>
    )
}

export default MapContainer;
