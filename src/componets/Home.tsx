// import React, { useEffect, useState } from 'react';
import MapContainer from './MapsContainer';
// import Marcadores from './Marcadores';
// import Login from '../firebase/LoginAuth';

import '../Styles/Home.css';
// import { Card } from 'primereact/card';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase/config';


export default function App2() {

    return (
        <div className="mb-5">


            <div className='Map-Container'>
                <MapContainer />
            </div>

        </div>
    );
}