import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FaWaze, FaMapMarkedAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchControl from '@/app/components/map/SearchControl'; // Assurez-vous d'avoir le bon chemin pour ce fichier
import LocateControl from '@/app/components/map/LocateControl';
import { generateMapLinks } from '@/app/utils/generateMapLinks'; // Assurez-vous d'avoir le bon chemin pour ce fichier

const EventMapComponent = ({ events }) => {
    const position = [50.5117484, 2.8320165]; 
    const [selectedDate, setSelectedDate] = useState(null);

    const filteredEvents = events.filter(event => {
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            return event.date === format(selectedDate, 'yyyy-MM-dd'); 
        } else {
            return true;
        }
    });

    const generateLinks = (event) => {
        const { wazeLink, googleMapsLink } = generateMapLinks(event.rue, event.departement, event.code_postal);
        return { wazeLink, googleMapsLink };
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    return (
        <div>
            <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                                <div className="leaflet-top leaflet-left date">
                    <div className="leaflet-control leaflet-bar">
                        <input
                            type="date"
                            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                            onChange={e => handleDateChange(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <SearchControl />
                <LocateControl />
                {filteredEvents.map(event => {
                    const { wazeLink, googleMapsLink } = generateLinks(event);

                    return (
                        <Marker key={event.id} position={[event.latitude, event.longitude]}>
                            <Popup>
                                <b>{event.ville}</b><br />
                                {event.type_braderie} <br />
                                Exposants: {event.nb_exposants}
                                <div className="map-links">
                                    <a href={wazeLink} target="_blank" rel="noopener noreferrer">
                                        <FaWaze className="icon" />
                                    </a>
                                    <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                                        <FaMapMarkedAlt className="icon" />
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default EventMapComponent;










