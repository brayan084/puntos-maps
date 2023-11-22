import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import '../Styles/MapsContainer.css';
import { Toast } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { db } from '../firebase/config';
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ScrollTop } from 'primereact/scrolltop';
import { Card } from "primereact/card";
import { Skeleton } from 'primereact/skeleton';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Login from "../firebase/LoginAuth";


export default function MapContainer() {


    const [direccion, setDireccion] = useState('');


    const imagen1 = require('../imagenes/png-clipart-black-m-marker-maps-black-rim.png')
    const [center, setCenter] = useState<{ lat: number, lng: number, adress: string }>({ lat: -34.61, lng: -58.38, adress: '' });
    const [zoom, setZoom] = useState(13);
    const [marcadoresON, setMarcadoresON] = useState<{ id: number, lat: number, lng: number, adress: string }[]>([]);
    // console.log(marcadoresON);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const toast = useRef<Toast>(null);
    const [isLoading, setIsLoading] = useState(true);

    const usuarioStorage = localStorage.getItem("user")
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    // Se encarga de traer todos los marcadores guardados del usuario y mostrarlos en el mapa

    useEffect(() => {

        if (usuarioStorage) {
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
                    setIsLoading(false);


                } catch (error) {
                    console.error(error);
                }
            };

            fetchDocument();
        }

        if (!usuarioStorage) {
            setIsLoading(false);
        }

    }, []);

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

        if (usuarioStorage) {
            try {
                await setDoc(doc(collection(db, `/Usuarios/${usuario.displayName}/Lugares-guardados`), Date.now().toString()), {
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

        } else {
            setShowDialog(false);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Por favor inicia sesion para guardar los puntos de interés' });
        }
    }

    // Filtra los marcadores para eliminar el marcador con el ID especificado
    const handleDeleteMarker = async (markerId: number) => {

        if (usuarioStorage) {
            try {
                console.log(markerId);
                const docRef = doc(db, `/Usuarios/${usuario.displayName}/Lugares-guardados/${markerId}`);
                await deleteDoc(docRef);
                console.log('Marker Deleted');
                // Actualiza el estado de los marcadores para reflejar el cambio en la base de datos
                setMarcadoresON(marcadoresON => marcadoresON.filter(marker => marker.id !== markerId));
            } catch (error) {
                console.error(error);
            }
        } else {
            setMarcadoresON(marcadoresON => marcadoresON.filter(marker => marker.id !== markerId));
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

    // funciones para hacer aparecer la barra del scroll de la lista de marcadores
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleCardClick = (lat: number, lng: number) => {
        setCenter({ lat, lng, adress: '' });
        setZoom(15);
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

            <div className="container">
                <div className="titulo-container">
                    <h1 className="titulo">GUARDA TUS PUNTOS DE INTERES</h1>
                </div>
                <div className="login-container">
                    <Login />
                </div>
            </div>
            <div className="Map-Container">
                {/* aqui esta el mapa y adentro del mapa esta el buscador  */}
                <div className="map-wrapper">
                    <GoogleMap
                        mapContainerStyle={styles}
                        center={center}
                        zoom={zoom}
                        onClick={handleMapClick}
                        options={{
                            // disableDefaultUI: true,
                            styles: mapStyles,
                            fullscreenControl: false,
                        }}
                    >
                        {/* El buscador */}
                        <div className="buscador-wrapper">
                            <button className="limpiar-boton" onClick={() => setDireccion('')}>
                                Limpiar
                            </button>
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
                        {/* Las marcas que realiza el user */}
                        {marcadoresON.map(marker => (
                            <Marker
                                key={marker.id}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                onClick={() => handleDeleteMarker(marker.id)}
                                icon={customMarkerIcon}
                            />
                        ))}
                    </GoogleMap>

                    <div>
                        <Dialog visible={showDialog} header="Guardar ubicación" showHeader={false} onHide={() => setShowDialog(false)} className="custom-dialog">
                            <div className="dialog-content">
                                {/* <h2 className="dialog-title">Guardar ubicación</h2> */}
                                <h2 className="dialog-message mb-3">¿Deseas guardar esta ubicación?</h2>
                                <div className="button-container">
                                    <Button label="Sí" onClick={GuardarMarkerDB} className="p-button-success" />
                                    <Button label="Solo ver la marca" onClick={() => setShowDialog(false)} className="p-button-secondary ml-2" />
                                </div>
                            </div>
                        </Dialog>
                    </div>

                </div>
                <div className='Marcadores'>
                    <div style={{ height: '75vh', overflow: isHovered ? 'auto' : 'hidden', borderRadius: '15px' }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="card w-full m-0 md:w-10rem lg:w-22rem flex justify-content-center p-0">
                            <h3>Puntos de Interes</h3>
                        </div>
                        {isLoading ? (
                            // Mostrar el skeleton mientras los marcadores están cargando
                            <div className="border-round border-1 surface-border p-4 surface-card">
                                <div className="flex mb-3">
                                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                    <div>
                                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                                        <Skeleton height=".5rem"></Skeleton>
                                    </div>
                                </div>
                                <Skeleton width="100%" height="150px"></Skeleton>
                                <div className="flex justify-content-between mt-3">
                                    <Skeleton width="4rem" height="2rem"></Skeleton>
                                    <Skeleton width="4rem" height="2rem"></Skeleton>
                                </div>

                                <br className="mt-3" />

                                <div className="flex mb-3">
                                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                    <div>
                                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                                        <Skeleton height=".5rem"></Skeleton>
                                    </div>
                                </div>
                                <Skeleton width="100%" height="150px"></Skeleton>
                                <div className="flex justify-content-between mt-3">
                                    <Skeleton width="4rem" height="2rem"></Skeleton>
                                    <Skeleton width="4rem" height="2rem"></Skeleton>
                                </div>
                            </div>
                        ) : (
                            // Mostrar las cards una vez que se hayan cargado los marcadores
                            <div>
                                {marcadoresON.map((item, index) => (

                                    <Card className="card-right w-full" key={index}>

                                        <div className="card-title" onClick={() => handleCardClick(item.lat, item.lng)}>
                                            <h3>{item.adress.split(',')[0]}</h3>
                                        </div>

                                        <span className="m-0"  >Direccion: {item.adress} </span>
                                        <br />
                                        <span className="m-0" >Lat: {item.lat}</span>
                                        <br />
                                        <span className="m-0" >Lng: {item.lng}</span>

                                        <div className="flex justify-content-end">
                                            <Button icon="pi pi-trash" severity="danger" onClick={() => (handleDeleteMarker(item.id))} />
                                        </div>
                                    </Card>
                                ))}
                                <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                            </div>
                        )}
                        <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                    </div>
                </div>
            </div>

        </div>
    )
}

// function geocodeByLatLng(arg0: { lat: any; lng: any; }) {
//     throw new Error("Function not implemented.");
// }

