import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { useGeolocation } from "../hooks/UseGeoLocation";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../Context/CitiesContext";
import Button from "./Button";
import { useUrlPosition } from "../hooks/UseUrlPpsition";
function Map() {
  const [MapPosition, SetMapPosition] = useState([40, 0]);
  const { Cities } = useCities();

  const { isLoading, position, getPosition } = useGeolocation();
  const { lat, lng } = useUrlPosition();
  useEffect(
    function () {
      if (lat && lng) SetMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (position) {
        SetMapPosition([position.lat, position.lng]);
      }
    },
    [position]
  );

  return (
    <div className={styles.mapContainer}>
      {!position && (
        <Button type={"position"} onClick={getPosition}>
          {isLoading ? "loading..." : "Get your position"}
        </Button>
      )}
      <MapContainer
        center={MapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {Cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji} </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {lat && lng && !isNaN(lat) && !isNaN(lng) && (
          <ChangeCenter position={MapPosition} />
        )}

        <NewClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function NewClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
export default Map;
