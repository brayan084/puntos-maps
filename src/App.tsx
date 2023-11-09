import React, { useState } from 'react';
import './App.css';
import MapContainer from './componets/MapsContainer';
import Buscador from './componets/Buscador';
import Marcadores from './componets/Marcadores';

function App() {
  const [lugarSeleccionado, setLugarSeleccionado] = useState<{ lat: number, lng: number } | null>({ lat: 0, lng: 0 });

  const handleLatLngSelect = (latLng: { lat: number, lng: number }) => {
    const lugar = { lat: latLng.lat, lng: latLng.lng }
    setLugarSeleccionado(lugar);
  }

  return (
    <div className="">
      <div className=''>
        <Buscador onLatLngSelect={handleLatLngSelect} />
      </div>
      <div className='Map-Container'>

        <MapContainer lugarSeleccionado={lugarSeleccionado} />

        <div className='Marcadores'>
          <Marcadores />
        </div>
      </div>

    </div>
  );
}

export default App;
