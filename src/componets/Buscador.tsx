import React ,{ useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import './Buscador.css';



interface BuscadorProps {
    onLatLngSelect: (latLng: { lat: number, lng: number }) => void;
}


const Buscador: React.FC<BuscadorProps> = ({ onLatLngSelect }) => {
    const [direccion, setDireccion] = useState('');

    const handleSelect = async (selectedDireccion:string) => {
        setDireccion(selectedDireccion);
        
        try {
            const results = await geocodeByAddress(selectedDireccion);
            const latLng = await getLatLng(results[0]);
            onLatLngSelect(latLng);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                            {suggestions.map((suggestion) => (
                                <div {...getSuggestionItemProps(suggestion)} className="sugerencia-item">
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        </div>
    );
};

export default Buscador;