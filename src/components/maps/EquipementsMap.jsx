import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// --- Correction pour l'icône par défaut de Leaflet (même que pour HotelsMap) ---
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

// Centre approximatif d'Agadir et niveau de zoom (peut être le même que pour les hôtels)
const AGADIR_CENTER = [30.42, -9.59]; // Latitude, Longitude
const INITIAL_ZOOM = 12; // Zoom un peu moins fort pour voir plus large ? à ajuster

function EquipementsMap({ equipements }) {
  // Filtrer les équipements pour ne garder que ceux avec des coordonnées valides
  const equipementsWithCoords = equipements.filter(equip =>
    equip.geom &&
    equip.geom.type === 'Point' &&
    Array.isArray(equip.geom.coordinates) &&
    equip.geom.coordinates.length === 2 &&
    typeof equip.geom.coordinates[0] === 'number' && // longitude
    typeof equip.geom.coordinates[1] === 'number'    // latitude
  );

  if (equipementsWithCoords.length === 0) {
       return <p className="text-center text-neutral-text-muted-light dark:text-neutral-text-muted-dark">Aucune donnée géographique disponible pour afficher la carte des équipements.</p>;
  }

  return (
    <div className="my-8 rounded-lg shadow-md overflow-hidden">
      <MapContainer
         center={AGADIR_CENTER}
         zoom={INITIAL_ZOOM}
         scrollWheelZoom={true}
         style={{ height: '500px', width: '100%' }}
       >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {equipementsWithCoords.map(equip => {
          // IMPORTANT : Inverser les coordonnées de GeoJSON [lon, lat] vers Leaflet [lat, lon]
          const position = [equip.geom.coordinates[1], equip.geom.coordinates[0]];

          return (
            <Marker key={equip.id} position={position}>
              <Popup>
                <div className="font-body">
                  <strong className="font-semibold block text-base mb-1">{equip.projet_nom || 'Équipement'}</strong>
                  <span className="block text-sm text-gray-600">Quartier: {equip.quartier || 'N/A'}</span>
                  {equip.composantes && (
                       <p className="text-xs mt-1 border-t pt-1">
                            {equip.composantes.split('\n').map((line, index) => (
                                <span key={index} className="block">{line.trim()}</span>
                            ))}
                       </p>
                  )}
                   {typeof equip.cout_total === 'number' && (
                       <p className="text-xs mt-1 font-medium">
                           Coût: {equip.cout_total.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                       </p>
                   )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default EquipementsMap;
