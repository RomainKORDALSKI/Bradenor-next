"use client";

import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { FaWaze, FaMapMarkedAlt } from "react-icons/fa";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchControl from "@/app/components/map/SearchControl";
import LocateControl from "@/app/components/map/LocateControl";
import { generateMapLinks } from "@/app/utils/generateMapLinks";

const EventMapComponent = ({ events }) => {
  const position = [50.5117484, 2.8320165];
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = events.filter((event) => {
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      return event.date === format(selectedDate, "yyyy-MM-dd");
    } else {
      return true;
    }
  });

  const generateLinks = (event) => {
    const { wazeLink, googleMapsLink } = generateMapLinks(
      event.rue,
      event.departement,
      event.code_postal
    );
    return { wazeLink, googleMapsLink };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {selectedDate
                ? format(selectedDate, "PP")
                : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => setSelectedDate(null)} variant="outline">
          Réinitialiser
        </Button>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SearchControl />
          <LocateControl />
          {filteredEvents.map((event) => {
            const { wazeLink, googleMapsLink } = generateLinks(event);

            return (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
              >
                <Popup>
                  <div className="space-y-2">
                    <h3 className="font-bold">{event.ville}</h3>
                    <p>{event.type_braderie}</p>
                    <p>Exposants: {event.nb_exposants}</p>
                    <div className="flex space-x-2">
                      <a
                        href={wazeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaWaze className="inline mr-1" /> Waze
                      </a>
                      <a
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaMapMarkedAlt className="inline mr-1" /> Google Maps
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default EventMapComponent;
