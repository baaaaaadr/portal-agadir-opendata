import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importe L pour gérer les icônes

// --- Correction pour l'icône par défaut de Leaflet avec Vite/React ---
// Voir: https://github.com/PaulLeCam/react-leaflet/issues/808
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- Fin de la correction de l'icône ---

// Centre approximatif d'Agadir et niveau de zoom
const AGADIR_CENTER = [30.42, -9.59]; // Latitude, Longitude
const INITIAL_ZOOM = 13;

function HotelsMap({ hotels }) {

  // Filtrer les hôtels pour ne garder que ceux avec des coordonnées valides
  const hotelsWithCoords = hotels.filter(hotel =>
    hotel.geom &&
    hotel.geom.type === 'Point' &&
    Array.isArray(hotel.geom.coordinates) &&
    hotel.geom.coordinates.length === 2 &&
    typeof hotel.geom.coordinates[0] === 'number' && // longitude
    typeof hotel.geom.coordinates[1] === 'number'    // latitude
  );

  if (hotelsWithCoords.length === 0) {
       return <p className="text-center text-neutral-text-muted-light dark:text-neutral-text-muted-dark">Aucune donnée géographique disponible pour afficher la carte des hôtels.</p>;
  }

  return (
    <div className="my-8 rounded-lg shadow-md overflow-hidden"> {/* Conteneur pour le style */}
      <MapContainer
         center={AGADIR_CENTER}
         zoom={INITIAL_ZOOM}
         scrollWheelZoom={true} // Permet le zoom avec la molette
         style={{ height: '500px', width: '100%' }} // Hauteur et largeur explicites
       >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotelsWithCoords.map(hotel => {
          // IMPORTANT : Inverser les coordonnées de GeoJSON [lon, lat] vers Leaflet [lat, lon]
          const position = [hotel.geom.coordinates[1], hotel.geom.coordinates[0]];

          return (
            <Marker key={hotel.id} position={position}>
              <Popup>
                <div className="font-body">
                  <strong className="font-semibold block text-base mb-1">{hotel.nom || 'Hôtel'}</strong>
                  <span className="block text-sm text-gray-600">{hotel.classement || 'Non classé'}</span>
                  {/* On pourrait ajouter l'adresse ici si besoin */}
                  {/* <span className="block text-xs mt-1">{hotel.adresse}</span> */}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default HotelsMap;
