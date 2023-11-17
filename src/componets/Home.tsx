// import React, { useEffect, useState } from 'react';
import MapContainer from './MapsContainer';
// import Marcadores from './Marcadores';
// import Login from '../firebase/LoginAuth';

import '../Styles/Home.css';
// import { Card } from 'primereact/card';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase/config';


export default function App2() {
    // console.trace()
    // const [marcadores, setMarcadores] = useState<{ id: number, lat: number, lng: number }[]>([]);


    // useEffect(() => {
    //     fetchDocument();
    // }, [])

    // const fetchDocument = async () => {

    //     try {
    //         const collectionRef = collection(db, "/Usuarios/luciano/Lugares-guardados");
    //         const querySnapshot = await getDocs(collectionRef);

    //         console.log(querySnapshot.docs);

    //         setMarcadores(querySnapshot.docs.map(doc => ({
    //             id: Number(doc.id),
    //             lat: doc.data().lat,
    //             lng: doc.data().lng
    //         })));

    //     } catch (error) {
    //         console.error(error);
    //         // Manejar el error...
    //     }

    // };

    return (
        <div className="mb-5">


            <div className='Map-Container'>
                <div className="map-wrapper">
                    <MapContainer />

                </div>

                {/* <div className='Marcadores'>
                    {marcadores.map((item) => (

                        <Card title="soy un lugar" className="card-right">
                            <span className="m-0">Lat: {item.lat}</span>
                            <span className="m-0">Lng: {item.lng}</span>
                        </Card>
                    ))}
                </div> */}
            </div>

        </div>
    );
}