import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, setDoc  } from "firebase/firestore";

interface MapaProps {
    lugarSeleccionado: { lat: number, lng: number } | null;
}

const MapContainer: React.FC<MapaProps> = ({ lugarSeleccionado }) => {


    const imagen1 = require('../imagenes/png-clipart-black-m-marker-maps-black-rim.png')
    const [center, setCenter] = useState<{ lat: number, lng: number }>({ lat: -34.61, lng: -58.38 });
    const [marcadores, setMarcadores] = useState<{ id: number, lat: number, lng: number }[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        if (lugarSeleccionado && lugarSeleccionado.lat === 0 && lugarSeleccionado.lng === 0) {
            // No hago nada jejeje
        } else if (lugarSeleccionado) {
            const newPuntoInteres = { id: Date.now(), ...lugarSeleccionado };
            setMarcadores([...marcadores, newPuntoInteres]);
            setCenter(lugarSeleccionado);
        }
    }, [lugarSeleccionado, marcadores]);

    // Guardar la ubicación en la base de datos de Firebase
    const handleGuardarClick = async () => {
        try {
            const docRef = await setDoc(doc(collection(db, "/Usuarios/luciano/Lugares-guardados" ), "punto-interes"), {
                lat: center.lat,
                lng: center.lng
            });
            console.log("Document written with ID: ", "nombre");
            setShowDialog(false);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    // Filtra los marcadores para eliminar el marcador con el ID especificado
    const handleMarkerClick = (markerId: number) => {
        setMarcadores(marcadores => marcadores.filter(marker => marker.id !== markerId));
    }

    // Crea un nuevo marcador con un ID único basado en la fecha y hora actual
    const handleMapClick = (event: google.maps.MapMouseEvent) => {


        if (event.latLng) {

            const newMarker = {
                id: Date.now(),
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            setMarcadores(marcadores => [...marcadores, newMarker]);
        }

        if (event.latLng) {
            setCenter({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            setShowDialog(true);
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
        diplay: "flex",
        height: "75vh",
        width: "1500px",
        // margin: "auto",
        marginTop: "50px",
    }

    const customMarkerIcon = {
        // esta imagen no la tengo en la carpeta de imagenes y esta buena
        // url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        url: imagen1,
        scaledSize: new window.google.maps.Size(30, 30), // Tamaño del ícono personalizado
    };

    return (
        <div className="map-container d-flex">
            <div className="map d-flex">
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
                            icon={customMarkerIcon}
                        />
                    ))}
                </GoogleMap>
                <Dialog visible={showDialog} onHide={() => setShowDialog(false)}>
                    <h2>Guardar ubicación</h2>
                    <p>¿Deseas guardar esta ubicación?</p>
                    <div className="p-grid">
                        <div className="p-col">
                            <Button label="Sí" onClick={handleGuardarClick} />
                        </div>
                        <div className="p-col">
                            <Button label="No" onClick={() => setShowDialog(false)} className="p-button-secondary" />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default MapContainer;
