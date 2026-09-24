// src/utils/location.js

const LOCATION_KEY = "e-servoo-user-location";

export const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem(LOCATION_KEY);

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (
      typeof parsed?.latitude !== "number" ||
      typeof parsed?.longitude !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Saved location error:", error);
    return null;
  }
};

export const saveUserLocation = (latitude, longitude) => {
  const location = {
    latitude,
    longitude,
    savedAt: Date.now(),
  };

  localStorage.setItem(
    LOCATION_KEY,
    JSON.stringify(location)
  );

  window.dispatchEvent(
    new CustomEvent("location-updated", {
      detail: location,
    })
  );

  return location;
};

export const requestUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error("Geolocation is not supported by this browser.")
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const location = saveUserLocation(
          latitude,
          longitude
        );

        resolve(location);
      },
      (error) => {
        console.warn(
          "Location permission/error:",
          error.message
        );

        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

export const clearSavedLocation = () => {
  localStorage.removeItem(LOCATION_KEY);

  window.dispatchEvent(
    new CustomEvent("location-updated", {
      detail: null,
    })
  );
};