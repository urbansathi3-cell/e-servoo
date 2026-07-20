export function safeJsonParse(value, fallback = null) {
  try {
    if (!value) return fallback;
    if (value === "undefined") return fallback;
    if (value === "null") return fallback;

    return JSON.parse(value);
  } catch (error) {
    console.warn("Invalid JSON in localStorage:", value);
    return fallback;
  }
}

export function saveJsonToStorage(key, value) {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save localStorage key:", key, error);
  }
}

export function getStoredUser() {
  const user = safeJsonParse(localStorage.getItem("user"), null);

  if (!user || typeof user !== "object" || Array.isArray(user)) {
    localStorage.removeItem("user");
    return null;
  }

  return user;
}

export function getStoredWorker() {
  const worker = safeJsonParse(localStorage.getItem("worker"), null);

  if (!worker || typeof worker !== "object" || Array.isArray(worker)) {
    localStorage.removeItem("worker");
    return null;
  }

  return worker;
}

export function getStoredToken() {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("token");
    return "";
  }

  return token;
}

export function getStoredWorkerToken() {
  const token = localStorage.getItem("workerToken");

  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("workerToken");
    return "";
  }

  return token;
}

export function getReviewedBookings() {
  const reviewedBookings = safeJsonParse(
    localStorage.getItem("reviewedBookings"),
    {}
  );

  if (
    !reviewedBookings ||
    typeof reviewedBookings !== "object" ||
    Array.isArray(reviewedBookings)
  ) {
    localStorage.removeItem("reviewedBookings");
    return {};
  }

  return reviewedBookings;
}

export function saveReviewedBookings(bookings) {
  if (!bookings || typeof bookings !== "object" || Array.isArray(bookings)) {
    localStorage.setItem("reviewedBookings", JSON.stringify({}));
    return;
  }

  localStorage.setItem("reviewedBookings", JSON.stringify(bookings));
}

export function getSavedAddresses() {
  const addresses = safeJsonParse(localStorage.getItem("savedAddresses"), []);

  if (!Array.isArray(addresses)) {
    localStorage.removeItem("savedAddresses");
    return [];
  }

  return addresses;
}

export function saveSavedAddresses(addresses) {
  if (!Array.isArray(addresses)) {
    localStorage.setItem("savedAddresses", JSON.stringify([]));
    return;
  }

  localStorage.setItem("savedAddresses", JSON.stringify(addresses));
}

export function getDefaultAddressIndex() {
  const index = Number(localStorage.getItem("defaultAddressIndex"));

  if (Number.isNaN(index) || index < 0) {
    localStorage.removeItem("defaultAddressIndex");
    return 0;
  }

  return index;
}

export function saveDefaultAddressIndex(index) {
  const cleanIndex = Number(index);

  if (Number.isNaN(cleanIndex) || cleanIndex < 0) {
    localStorage.setItem("defaultAddressIndex", "0");
    return;
  }

  localStorage.setItem("defaultAddressIndex", String(cleanIndex));
}

export function clearCustomerSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("reviewedBookings");
  localStorage.removeItem("savedAddresses");
  localStorage.removeItem("defaultAddressIndex");
}

export function clearWorkerSession() {
  localStorage.removeItem("worker");
  localStorage.removeItem("workerToken");
}

export function clearAllSessions() {
  clearCustomerSession();
  clearWorkerSession();
}