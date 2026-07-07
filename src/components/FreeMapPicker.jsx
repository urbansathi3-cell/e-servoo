import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ setPosition, reverseGeocode }) {
  useMapEvents({
    click(event) {
      const newPosition = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };

      setPosition(newPosition);
      reverseGeocode(newPosition);
    },
  });

  return null;
}

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView([position.lat, position.lng], 16);
  }, [position, map]);

  return null;
}

function FreeMapPicker({ onAddressSelect, language = "en" }) {
  const defaultPosition = {
    lat: 20.2961,
    lng: 85.8245,
  };

  const [position, setPosition] = useState(defaultPosition);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const text = {
    title: "📍 Select Location",
    subtitle: "Map par tap karo ya current location use karo.",
    useCurrentLocation: "Use Current Location",
    detecting: "Detecting...",
    selectedAddress: "Selected Address",
    noAddress: "No address selected",
    confirm: "Confirm This Address",
    permission: "Location permission allow kariye.",
    notSupported: "Current location browser me supported nahi hai.",
    addressLoading: "Address detect ho raha hai...",
  };

  const reverseGeocode = async (location) => {
    setLoadingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`
      );

      const data = await res.json();

      const address =
        data.display_name ||
        `Latitude: ${location.lat}, Longitude: ${location.lng}`;

      setSelectedAddress(address);
    } catch (error) {
      console.log(error);

      setSelectedAddress(
        `Latitude: ${location.lat}, Longitude: ${location.lng}`
      );
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    reverseGeocode(defaultPosition);
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(text.notSupported);
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        const currentPosition = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };

        setPosition(currentPosition);
        reverseGeocode(currentPosition);
        setLoadingLocation(false);
      },
      (error) => {
        console.log(error);
        setLoadingLocation(false);
        alert(text.permission);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const confirmAddress = () => {
    if (!selectedAddress) {
      alert(text.noAddress);
      return;
    }

    onAddressSelect({
      address: selectedAddress,
      location: position,
    });
  };

  return (
    <div className="bg-[#E1E9E5]/90 border border-[#6FA8AA] rounded-3xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[#08566E] text-2xl font-extrabold">
            {text.title}
          </h3>

          <p className="text-[#08566E]/75 text-sm font-semibold">
            {text.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={loadingLocation}
          className="bg-[#08566E] text-[#E1E9E5] px-5 py-3 rounded-full font-extrabold hover:bg-[#06485C] transition disabled:bg-gray-500"
        >
          {loadingLocation ? text.detecting : text.useCurrentLocation}
        </button>
      </div>

      <div className="w-full h-[320px] rounded-3xl overflow-hidden border border-[#6FA8AA]">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[position.lat, position.lng]}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const marker = event.target;
                const newPosition = marker.getLatLng();

                const updatedPosition = {
                  lat: newPosition.lat,
                  lng: newPosition.lng,
                };

                setPosition(updatedPosition);
                reverseGeocode(updatedPosition);
              },
            }}
          />

          <MapClickHandler
            setPosition={setPosition}
            reverseGeocode={reverseGeocode}
          />

          <RecenterMap position={position} />
        </MapContainer>
      </div>

      <div className="mt-4 bg-white rounded-2xl p-4 border border-[#6FA8AA]">
        <p className="text-[#6FA8AA] text-sm font-bold">
          {text.selectedAddress}
        </p>

        <p className="text-[#08566E] font-bold mt-1">
          {loadingAddress
            ? text.addressLoading
            : selectedAddress || text.noAddress}
        </p>
      </div>

      <button
        type="button"
        onClick={confirmAddress}
        className="mt-4 w-full bg-[#08566E] text-[#E1E9E5] py-4 rounded-2xl font-extrabold hover:bg-[#06485C] transition"
      >
        {text.confirm}
      </button>
    </div>
  );
}

export default FreeMapPicker;