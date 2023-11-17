import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import '../Styles/MapsContainer.css';
import { Toast } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { db } from '../firebase/config';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ScrollTop } from 'primereact/scrolltop';
import { Card } from "primereact/card";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Login from "../firebase/LoginAuth";


export default function MapContainer() {


    const [direccion, setDireccion] = useState('');


    const imagen1 = require('../imagenes/png-clipart-black-m-marker-maps-black-rim.png')
    const [center, setCenter] = useState<{ lat: number, lng: number, adress: string }>({ lat: -34.61, lng: -58.38, adress: '' });
    const [marcadoresON, setMarcadoresON] = useState<{ id: number, lat: number, lng: number, adress: string }[]>([]);
    // console.log(marcadoresON);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const toast = useRef<Toast>(null);

    const usuarioStorage = localStorage.getItem("user")
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    // Se encarga de traer todos los marcadores guardados del usuario y mostrarlos en el mapa
    useEffect(() => {
        const fetchDocument = async () => {

            try {
                const collectionRef = collection(db, `/Usuarios/${usuario.displayName}/Lugares-guardados`);
                const querySnapshot = await getDocs(collectionRef);


                setMarcadoresON(querySnapshot.docs.map(doc => ({
                    id: parseInt(doc.data().id),
                    lat: doc.data().lat,
                    lng: doc.data().lng,
                    adress: doc.data().adress
                })));

            } catch (error) {
                console.error(error);
            }
        };

        fetchDocument();
    }, [usuario.displayName]);
    // Dato curioso si se le pasa 'usuario' a las dependencias del useEffect, cuando se marca y no se guarda el punto de interés, se borra.
    // Pero cuando se le pasa 'usuario.displayName' a las dependencias del useEffect, cuando se marca y no se guarda el punto de interés, no se borra.

    // Function to get the address from latitude and longitude
    const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB2w6_RoDhHWxWOWn8Q-FuYjly9mHFPl5s`);
        const data = await response.json();
        const address = data.results[0].formatted_address;
        return address;
    };

    // Guardar la ubicación en la base de datos de Firebase
    const GuardarMarkerDB = async () => {
        try {
            await setDoc(doc(collection(db, `/Usuarios/${usuario.displayName}/Lugares-guardados`)/* , "punto-interes" */), {
                id: Date.now(),
                lat: center.lat,
                lng: center.lng,
                adress: center.adress
            });
            console.log('Document Save');
            setShowDialog(false);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    // Esta funcion se encarga de traducir la ubicacion de string a coordenadas y guardarla en la base de datos (si es que se desea)
    const handleSelect = async (selectedDireccion: string, ref: any) => {
        setDireccion(selectedDireccion);

        try {
            // Esto traduce la direccion de string a coordenadas
            const results = await geocodeByAddress(selectedDireccion);
            console.log(results[0].formatted_address);
            const latLng = await getLatLng(results[0]);;
            // EJ: la direccion de la universidad UADE se ve asi 'Lima 757, C1073 CABA, Argentina'

            AddMarker(latLng.lat, latLng.lng);

        } catch (error) {
            console.log(error);
        }
    };

    // Crea un nuevo marcador con un ID específico y lo agrega al arreglo de marcadores
    const AddMarker = async (lat: number, lng: number) => {
        if (lat && lng) {
            try {
                const adress = await getAddressFromCoordinates(lat, lng);
                const newMarker = {
                    id: Date.now(),
                    lat: lat,
                    lng: lng,
                    adress: adress
                };
                setMarcadoresON(marcadoresON => [...marcadoresON, newMarker]);
                setCenter({ lat: lat, lng: lng, adress: adress });
                setShowDialog(true);
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Funcion para agregar un marcador al mapa con el evento 'click'
    const handleMapClick = async (event: google.maps.MapMouseEvent) => {
        AddMarker(event.latLng?.lat() || 0, event.latLng?.lng() || 0);
    }

    // Filtra los marcadores para eliminar el marcador con el ID especificado
    const handleMarkerClick = (markerId: number) => {
        // aqui podria agregar logica para eliminar el marcador con el ID especificad, con solo tocar el mapa
        setMarcadoresON(marcadoresON => marcadoresON.filter(marker => marker.id !== markerId));
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

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
        width: "1400px",
        margin: "12px 0px 20px 80px",
        marginTop: "50px",
        borderRadius: "15px",
    }

    const customMarkerIcon = {
        // esta imagen no la tengo en la carpeta de imagenes y esta buena
        // url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        url: imagen1,
        scaledSize: new window.google.maps.Size(30, 30), // Tamaño del ícono personalizado
    };

    return (
        <div>
            <Toast ref={toast} />

            <div className="flex flex-row flex-wrap " >
                <div className="">
                    <Login />
                </div>
                <div className="">
                    <h1>Buscador de Lugares</h1>
                    <PlacesAutocomplete
                        value={direccion}
                        onChange={setDireccion}
                        onSelect={handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div style={{ width: '300px' }}>
                                <input
                                    {...getInputProps({
                                        placeholder: 'Buscar lugares...',
                                        className: 'buscador-input',
                                    })}
                                />
                                <div className="sugerencias-container">
                                    {loading && <div>Cargando...</div>}
                                    {suggestions.map((suggestion, index) => (
                                        <div {...getSuggestionItemProps(suggestion)} key={index} className="sugerencia-item">
                                            {suggestion.description}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            </div>
            <div className="Map-Container">
                <div className="map-wrapper">
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
                        {marcadoresON.map(marker => (
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
                                <Button label="Sí" onClick={GuardarMarkerDB} />
                            </div>
                            <div className="p-col">
                                <Button label="No" onClick={() => setShowDialog(false)} className="p-button-secondary" />
                            </div>
                        </div>
                    </Dialog>
                </div>
                <div className='Marcadores'>
                    <div style={{ height: '75vh', overflow: isHovered ? 'auto' : 'hidden', borderRadius: '15px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {/* <h1>Marcadores</h1> */}
                        {marcadoresON.map((item, index) => (

                            <Card title="soy un lugar" className="card-right w-full" key={index}>

                                <span className="m-0" >Direccion: {item.adress} </span>
                                <br />
                                <span className="m-0" >Lat: {item.lat}</span>
                                <br />
                                <span className="m-0" >Lng: {item.lng}</span>
                            </Card>
                        ))}
                        <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                        {/* <Marcadores /> */}
                    </div>
                </div>
            </div>

        </div>
    )
}

// function geocodeByLatLng(arg0: { lat: any; lng: any; }) {
//     throw new Error("Function not implemented.");
// }

