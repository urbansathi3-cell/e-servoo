import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { FaArrowLeft, FaCrosshairs, FaMapMarkerAlt, FaCheck, FaSearch, FaTimes } from "react-icons/fa";

const DEFAULT_LOCATION = { lat: 21.4669, lng: 84.0107 };

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapMover({ position }) {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    map.flyTo([position.lat, position.lng], 17, { duration: 0.8 });
  }, [position, map]);
  return null;
}

function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(event) {
      onLocationChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function LocationPicker({ initialLocation = null, onClose, onConfirm }) {
  const [position, setPosition] = useState(initialLocation || DEFAULT_LOCATION);
  const [address, setAddress] = useState("Move the pin, search a place, or use your current location");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [locationError, setLocationError] = useState("");

  const getAddressFromCoordinates = async (lat, lng) => {
    setLoadingAddress(true);
    setLocationError("");
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
      const response = await fetch(url, { headers: { Accept: "application/json", "Accept-Language": "en" } });
      if (!response.ok) throw new Error("Unable to find address");
      const data = await response.json();
      const displayAddress = data?.display_name || "Selected location";
      setAddress(displayAddress);
      return displayAddress;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setAddress("Selected map location");
      return "Selected map location";
    } finally {
      setLoadingAddress(false);
    }
  };

  const searchLocation = async (event) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (query.length < 2) {
      setLocationError("Enter at least 2 characters to search.");
      return;
    }
    setSearchLoading(true);
    setLocationError("");
    setSearchResults([]);
    setShowSearchResults(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=in`;
      const response = await fetch(url, { headers: { Accept: "application/json", "Accept-Language": "en" } });
      if (!response.ok) throw new Error("Location search failed");
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setLocationError("Location not found. Try a nearby area, landmark, city or PIN code.");
        setShowSearchResults(false);
        return;
      }
      setSearchResults(data);
    } catch (error) {
      console.error("Location search error:", error);
      setLocationError("Unable to search location right now. Please try again.");
      setShowSearchResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const selectSearchResult = async (result) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setLocationError("This search result has an invalid location.");
      return;
    }
    setPosition({ lat, lng });
    setAddress(result.display_name || "Selected searched location");
    setSearchQuery(result.display_name || searchQuery);
    setSearchResults([]);
    setShowSearchResults(false);
    setLocationError("");
    await getAddressFromCoordinates(lat, lng);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setLocationError("");
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by this browser.");
      return;
    }
    setLoadingLocation(true);
    setLocationError("");
    setShowSearchResults(false);
    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const nextPosition = { lat: location.coords.latitude, lng: location.coords.longitude };
        setPosition(nextPosition);
        await getAddressFromCoordinates(nextPosition.lat, nextPosition.lng);
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let message = "Unable to get your location.";
        if (error.code === 1) message = "Location permission was denied. Please allow location access.";
        if (error.code === 2) message = "Your location could not be detected.";
        if (error.code === 3) message = "Location request timed out. Please try again.";
        setLocationError(message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (initialLocation?.lat !== undefined && initialLocation?.lng !== undefined) {
      getAddressFromCoordinates(initialLocation.lat, initialLocation.lng);
    }
  }, []);

  const handleLocationChange = async (nextPosition) => {
    setPosition(nextPosition);
    setShowSearchResults(false);
    await getAddressFromCoordinates(nextPosition.lat, nextPosition.lng);
  };

  const handleConfirm = () => {
    if (!position) {
      setLocationError("Please select a location first.");
      return;
    }
    onConfirm({ latitude: position.lat, longitude: position.lng, address });
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white">
      <div className="absolute top-0 left-0 right-0 z-[700]">
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="w-11 h-11 rounded-full bg-[#F1F7F7] text-[#08566E] flex items-center justify-center text-lg active:scale-90 transition shrink-0" aria-label="Close map">
              <FaArrowLeft />
            </button>
            <div className="min-w-0">
              <h2 className="font-black text-[#08566E] text-base leading-tight">Select Service Location</h2>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Search or select your exact location</p>
            </div>
          </div>

          <form onSubmit={searchLocation} className="relative mt-3">
            <div className="flex items-center gap-2 bg-[#F3F8F7] border border-[#B4DBDC] rounded-2xl px-3 py-2.5 shadow-sm focus-within:border-[#08566E] focus-within:ring-2 focus-within:ring-[#08566E]/10 transition">
              <FaSearch className="text-[#08566E] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setLocationError("");
                  if (event.target.value.trim().length === 0) {
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchResults(true);
                }}
                placeholder="Search area, landmark, city or PIN code"
                className="min-w-0 flex-1 bg-transparent outline-none text-sm font-bold text-[#043A4A] placeholder:text-gray-400"
              />
              {searchQuery && (
                <button type="button" onClick={clearSearch} className="w-7 h-7 rounded-full bg-white text-gray-500 flex items-center justify-center shrink-0 active:scale-90 transition" aria-label="Clear search">
                  <FaTimes className="text-xs" />
                </button>
              )}
              <button type="submit" disabled={searchLoading} className="bg-[#08566E] text-white px-3.5 py-2 rounded-xl text-xs font-black shrink-0 disabled:opacity-60">
                {searchLoading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block"></span> : "Search"}
              </button>
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-[58px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.place_id || result.osm_id}-${index}`}
                    type="button"
                    onClick={() => selectSearchResult(result)}
                    className="w-full text-left px-4 py-3.5 border-b last:border-b-0 border-gray-100 hover:bg-[#F1F8F7] active:bg-[#E7F3F1] transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F5F3] text-[#08566E] flex items-center justify-center shrink-0 mt-0.5">
                        <FaMapMarkerAlt className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#043A4A] line-clamp-2">{result.display_name}</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-1">Tap to select this location</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      <MapContainer center={[position.lat, position.lng]} zoom={16} zoomControl={false} className="w-full h-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapMover position={position} />
        <MapClickHandler onLocationChange={handleLocationChange} />
        <Marker position={[position.lat, position.lng]} icon={markerIcon} />
      </MapContainer>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[400] -translate-x-1/2 -translate-y-[100%]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-[#08566E]/15 animate-ping absolute inset-0"></div>
          <div className="relative w-12 h-12 rounded-full bg-[#08566E] border-4 border-white shadow-xl flex items-center justify-center text-white"><FaMapMarkerAlt /></div>
        </div>
      </div>

      <button type="button" onClick={useCurrentLocation} disabled={loadingLocation} className="absolute right-4 bottom-[245px] z-[450] w-12 h-12 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-[#08566E] text-lg active:scale-90 transition disabled:opacity-60" aria-label="Use current location">
        {loadingLocation ? <span className="w-5 h-5 border-2 border-[#08566E] border-t-transparent rounded-full animate-spin"></span> : <FaCrosshairs />}
      </button>

      <div className="absolute left-0 right-0 bottom-0 z-[500] bg-white rounded-t-[30px] shadow-[0_-15px_45px_rgba(0,0,0,0.18)] px-5 pt-5 pb-6">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E8F5F3] text-[#08566E] flex items-center justify-center shrink-0"><FaMapMarkerAlt /></div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">SERVICE LOCATION</p>
            <p className="text-sm font-black text-[#043A4A] mt-1 leading-relaxed line-clamp-3">{loadingAddress ? "Finding address..." : address}</p>
          </div>
        </div>

        <div className="mt-3 px-3 py-2 rounded-xl bg-[#F5F9F9] text-[10px] font-bold text-gray-500">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</div>

        {locationError && <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs font-bold text-red-600">{locationError}</div>}

        <button type="button" onClick={handleConfirm} disabled={loadingAddress} className="mt-4 w-full bg-[#08566E] hover:bg-[#06485C] active:scale-[0.98] disabled:opacity-60 text-white py-4 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 transition">
          <FaCheck />
          CONFIRM LOCATION
        </button>
      </div>
    </div>
  );
}

export default LocationPicker;
