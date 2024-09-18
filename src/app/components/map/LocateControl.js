import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

const LocateControl = () => {
  const map = useMap();

  useEffect(() => {
    const locateControl = L.control.locate({
      position: 'topright',
      strings: {
        title: "Show me where I am"
      },
      setView: 'once',
      flyTo: true,
      keepCurrentZoomLevel: true
    }).addTo(map);

    return () => {
      map.removeControl(locateControl);
    };
  }, [map]);

  return null;
};
export default LocateControl;