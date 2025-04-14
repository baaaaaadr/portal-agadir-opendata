import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// --- Icon fix (same as before) ---
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
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- End icon fix ---

const AGADIR_CENTER = [30.42, -9.59];
const INITIAL_ZOOM = 14;

function JardinsMap({ jardins }) {
  const jardinsWithCoords = jardins.filter(jardin =>
    jardin.geom?.type === 'Point' && Array.isArray(jardin.geom?.coordinates) && jardin.geom.coordinates.length === 2
  );

  if (jardinsWithCoords.length === 0) {
    return <p className="text-center text-neutral-text-muted-light dark:text-neutral-text-muted-dark">Aucune donnée géographique disponible pour la carte des jardins.</p>;
  }

  return (
    <div className="my-6 rounded-lg shadow-md overflow-hidden">
      <MapContainer center={AGADIR_CENTER} zoom={INITIAL_ZOOM} scrollWheelZoom={true} style={{ height: '450px', width: '100%' }}>
        <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {jardinsWithCoords.map(jardin => {
          const position = [jardin.geom.coordinates[1], jardin.geom.coordinates[0]];
          return (
            <Marker key={jardin.id} position={position}>
              <Popup>
                <div className="font-body text-sm">
                  <strong className="font-semibold block text-base mb-1">{jardin.nom || 'Jardin'}</strong>
                  <span className="block text-xs text-gray-600">Quartier: {jardin.quartier || 'N/A'}</span>
                  <span className="block text-xs mt-1">Horaires: {jardin.horaires || 'N/A'}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default JardinsMap;
