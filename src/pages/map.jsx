// src/Map.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc4ZGNlOGU4OTYzZDQ3MTk4MjNkZWU5ZGE3MDc2OTkxIiwiaCI6Im11cm11cjY0In0="; 

const MapClickHandler = ({ start, end, setStart, setEnd }) => {
  useMapEvents({
    click(e) {
      if (!start) setStart(e.latlng);
      else if (!end) setEnd(e.latlng);
      else {
        setStart(e.latlng);
        setEnd(null);
      }
    },
  });
  return null;
};

// FitBounds component
const FitBounds = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(L.latLngBounds(route), { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
};


const Map = ({ onRouteComplete }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const getRoute = async () => {
      if (!start || !end) {
        setRoute([]);
        setDistance(null);
        setDuration(null);
        return;
      }

      try {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat],
            ],
          },
          { headers: { Authorization: apiKey } }
        );

        const coords = response.data.features[0].geometry.coordinates;
        setRoute(coords.map(([lng, lat]) => [lat, lng]));

        const summary = response.data.features[0].properties.summary;
        const dist = (summary.distance / 1000).toFixed(2);
        setDistance(dist);
        setDuration(Math.ceil(summary.duration / 60));

        if (onRouteComplete) {
          onRouteComplete({
            distance: dist,
            start,
            destination: end,
          });
        }
      } catch (err) {
        console.error('Error fetching route:', err);
        setRoute([]);
        setDistance(null);
        setDuration(null);
      }
    };
    getRoute();
  }, [start, end, onRouteComplete]);

  return (
    <div>
      <MapContainer center={[20, 78]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler start={start} end={end} setStart={setStart} setEnd={setEnd} />
        {start && <Marker position={start} />}
        {end && <Marker position={end} />}
        {route.length > 0 && (
          <Polyline
            positions={route}
            color="blue"
            weight={6}       // slightly thicker
            opacity={1}      // fully visible
            smoothFactor={1.5}
          />
        )}
        {route.length > 0 && <FitBounds route={route} />}
      </MapContainer>

      {distance !== null && duration !== null && (
        <div style={{ marginTop: '10px', fontSize: '16px' }}>
          <strong>Distance:</strong> {distance} km | <strong>Duration:</strong> {duration} min
        </div>
      )}
    </div>
  );
};

export default Map;
