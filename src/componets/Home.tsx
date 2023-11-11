import React, { useState } from 'react';
import MapContainer from './MapsContainer';
import Buscador from './Buscador';
import Marcadores from './Marcadores';
import Login from '../firebase/LoginAuth';

import '../Styles/Home.css';
import { Card } from 'primereact/card';


function App2() {
    const [lugarSeleccionado, setLugarSeleccionado] = useState<{ lat: number, lng: number } | null>({ lat: 0, lng: 0 });

    const handleLatLngSelect = (latLng: { lat: number, lng: number }) => {
        const lugar = { lat: latLng.lat, lng: latLng.lng }
        setLugarSeleccionado(lugar);
    }

    return (
        <div className="mb-5">

            <div className='Buscador'>
                <Login />
                <div className='flex'>
                    <Buscador onLatLngSelect={handleLatLngSelect} />
                </div>
            </div>
            <div className='Map-Container'>
                <div className="map-wrapper">
                    <MapContainer lugarSeleccionado={lugarSeleccionado} />

                </div>

                <div className='Marcadores'>
                    <Card title="Title" className="card-right">
                        <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
                            numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                        </p>
                    </Card>
                    <Card title="Title" className="card-right">
                        <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
                            numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                        </p>
                    </Card>
                    <Card title="Title" className="card-right">
                        <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
                            numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                        </p>
                    </Card>
                    {/* <Marcadores /> */}
                </div>
            </div>

        </div>
    );
}

export default App2;