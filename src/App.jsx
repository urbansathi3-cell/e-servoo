import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getStoredUser, getStoredWorker } from "./utils/storage";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import AIAssistant from "./components/AIAssistant";
import WorkerOfMonth from "./components/WorkerOfMonth";
import Services from "./components/Services";
import Workers from "./components/Workers";
import BookingForm from "./components/BookingForm";
import CustomerDashboard from "./components/CustomerDashboard";
import MyBookings from "./components/MyBookings";
import WhatsappButton from "./components/WhatsappButton";
import Loader from "./components/Loader";
import FooterNav from "./components/FooterNav";
import AuthScreen from "./components/AuthScreen";

import Profile from "./components/Profile";
import Rewards from "./components/Rewards";
import Contact from "./components/Contact";
import Terms from "./components/Terms";

import Welcome from "./components/Welcome";
import WorkerLogin from "./components/WorkerLogin";
import WorkerDashboard from "./components/WorkerDashboard";


// =====
// LOCATION CONFIG
// =====

const LOCATION_STORAGE_KEY = "e-servoo-user-location";


// =====
// SAVE USER LOCATION
// =====

function saveUserLocation(position) {
  if (!position?.coords) return;

  const latitude = Number(position.coords.latitude);
  const longitude = Number(position.coords.longitude);
  const accuracy = Number(position.coords.accuracy || 0);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return;
  }

  const locationData = {
    latitude,
    longitude,
    accuracy,
    timestamp: Date.now(),
  };

  localStorage.setItem(
    LOCATION_STORAGE_KEY,
    JSON.stringify(locationData)
  );

  window.dispatchEvent(
    new CustomEvent("location-updated", {
      detail: locationData,
    })
  );
}


// =====
// REQUEST USER LOCATION
// =====

async function requestUserLocation() {
  if (!navigator.geolocation) {
    console.warn(
      "E-SERVOO: Geolocation is not supported by this browser."
    );

    window.dispatchEvent(
      new CustomEvent("location-unavailable")
    );

    return;
  }

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          "E-SERVOO: User location received."
        );

        saveUserLocation(position);
      },

      (error) => {
        console.warn(
          "E-SERVOO: Location permission/error:",
          error
        );

        window.dispatchEvent(
          new CustomEvent("location-error", {
            detail: error,
          })
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  };

  if (navigator.permissions?.query) {
    try {
      const permission =
        await navigator.permissions.query({
          name: "geolocation",
        });

      if (
        permission.state === "granted" ||
        permission.state === "prompt"
      ) {
        requestLocation();
        return;
      }

      if (permission.state === "denied") {
        console.warn(
          "E-SERVOO: Location permission is denied."
        );

        window.dispatchEvent(
          new CustomEvent(
            "location-permission-denied"
          )
        );

        return;
      }
    } catch (error) {
      console.warn(
        "E-SERVOO: Permission API unavailable.",
        error
      );

      requestLocation();
      return;
    }
  }

  requestLocation();
}


// =====
// REVEAL ON SCROLL
// =====

function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`${className} transition-all duration-700 ease-out will-change-transform ${
        visible
          ? "opacity-100 translate-y-0 scale-100 blur-0"
          : "opacity-0 translate-y-8 scale-[0.98] blur-[2px]"
      }`}
    >
      {children}
    </div>
  );
}


// =====
// LOGIN REQUIRED MODAL
// =====

function LoginRequiredModal({
  onClose,
  onLogin,
}) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-md flex items-center justify-center px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-[#E1E9E5] border border-white/80 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">

        <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#9ECFD0] rounded-full blur-3xl opacity-80" />

        <div className="absolute -bottom-20 -right-16 w-52 h-52 bg-[#6FA8AA] rounded-full blur-3xl opacity-70" />

        <div className="relative p-7 text-center">

          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-4xl shadow-xl">
            🔐
          </div>

          <h2 className="text-[#043A4A] text-3xl font-black mt-5">
            Login First
          </h2>

          <p className="text-[#08566E] font-bold mt-3 leading-relaxed">
            Worker booking ke liye pehle customer login required
            hai. Login ke baad selected worker ka booking form
            automatically open ho jayega.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-7">

            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-2xl bg-white text-[#08566E] border border-[#B4DBDC] font-black shadow-md hover:scale-[1.02] transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="py-3 rounded-2xl bg-[#08566E] text-[#E1E9E5] font-black shadow-xl hover:scale-[1.02] transition"
            >
              Login
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}


// =====
// HOME PAGE
// =====

function HomePage({
  seniorMode,
  setSeniorMode,
  setSelectedService,
  selectedService,
  selectedWorker,
  setSelectedWorker,
  language,
  showWelcome,
  setShowWelcome,
  workerLoggedIn,
  customerLocation,
  setCustomerLocation,
  changeLanguage,
  handleWorkerSelect,
}) {

  // ===
  // WORKER SAFETY
  // ===

  if (workerLoggedIn) {
    return (
      <div
        data-theme="light"
        className="min-h-screen w-full bg-[#B4DBDC] text-[#08566E] overflow-x-hidden"
        style={{
          colorScheme: "only light",
          backgroundColor: "#B4DBDC",
          color: "#08566E",
        }}
      >
        <WorkerDashboard language={language} />
      </div>
    );
  }


  // ===
  // WELCOME
  // ===

  if (showWelcome) {
    return (
      <Welcome
        setShowWelcome={setShowWelcome}
      />
    );
  }


  // ===
  // BOOKING
  // ===

  if (selectedWorker) {
    return (
      <>
        <Navbar />

        <BookingForm
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
          customerLocation={customerLocation}
          setCustomerLocation={setCustomerLocation}
        />
      </>
    );
  }


  // ===
  // CUSTOMER HOME
  // ===

  return (
    <>
      <Navbar />

      <RevealOnScroll delay={0}>
        <Hero
          language={language}
          customerLocation={customerLocation}
          setCustomerLocation={setCustomerLocation}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <Stats />
      </RevealOnScroll>

      <RevealOnScroll delay={160}>
        <WorkerOfMonth
          language={language}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={220}>
        <Services
          language={language}
          setSelectedService={setSelectedService}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={280}>
        <Workers
          language={language}
          setSelectedWorker={handleWorkerSelect}
          selectedService={selectedService}
          customerLocation={customerLocation}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={340}>
        <WhatsappButton />
      </RevealOnScroll>
    </>
  );
}


// =====
// APP
// =====

function App() {

  const savedUser = getStoredUser();
  const savedWorker = getStoredWorker();


  // ===
  // APP LOADING
  // ===

  const [appLoading, setAppLoading] =
    useState(true);


  // ===
  // BOOKING STATE
  // ===

  const [selectedService, setSelectedService] =
    useState("All");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [pendingWorker, setPendingWorker] =
    useState(null);


  // ===
  // SCREEN STATE
  // ===

  const [showWelcome, setShowWelcome] =
    useState(false);

  const [showLoginScreen, setShowLoginScreen] =
    useState(false);

  const [showLoginRequired, setShowLoginRequired] =
    useState(false);


  // ===
  // CUSTOMER LOGIN
  // ===

  const [isLoggedIn, setIsLoggedIn] =
    useState(Boolean(savedUser));


  // ===
  // WORKER LOGIN
  // ===

  const [workerLoggedIn, setWorkerLoggedIn] =
    useState(Boolean(savedWorker));


  // ===
  // SENIOR MODE
  // ===

  const [seniorMode, setSeniorMode] =
    useState(() => {
      return (
        localStorage.getItem("seniorMode") === "true"
      );
    });


  // ===
  // LANGUAGE
  // ===

  const [language, setLanguage] =
    useState(() => {

      const savedLanguage =
        localStorage.getItem("language") ||
        localStorage.getItem("lang");

      if (
        savedLanguage === "en" ||
        savedLanguage === "hi" ||
        savedLanguage === "od"
      ) {
        return savedLanguage;
      }

      localStorage.setItem(
        "language",
        "en"
      );

      localStorage.setItem(
        "lang",
        "en"
      );

      return "en";
    });


  // ===
  // CUSTOMER LOCATION
  // ===

  const [customerLocation, setCustomerLocation] =
    useState(() => {

      try {

        const savedLocation =
          localStorage.getItem(
            "eservoo_customer_location"
          );

        if (!savedLocation) {
          return {
            address: "",
            latitude: null,
            longitude: null,
            accuracy: null,
          };
        }

        const parsed =
          JSON.parse(savedLocation);

        if (
          typeof parsed !== "object" ||
          parsed === null
        ) {
          throw new Error(
            "Invalid saved location"
          );
        }

        return {
          address: parsed.address || "",
          latitude:
            typeof parsed.latitude === "number"
              ? parsed.latitude
              : null,
          longitude:
            typeof parsed.longitude === "number"
              ? parsed.longitude
              : null,
          accuracy:
            typeof parsed.accuracy === "number"
              ? parsed.accuracy
              : null,
        };

      } catch (error) {

        console.warn(
          "Unable to restore customer location:",
          error
        );

        return {
          address: "",
          latitude: null,
          longitude: null,
          accuracy: null,
        };
      }
    });


  // ===
  // SAVE CUSTOMER LOCATION
  // ===

  useEffect(() => {

    try {

      if (
        customerLocation &&
        typeof customerLocation === "object"
      ) {
        localStorage.setItem(
          "eservoo_customer_location",
          JSON.stringify(customerLocation)
        );
      }

    } catch (error) {

      console.warn(
        "Unable to save customer location:",
        error
      );
    }

  }, [customerLocation]);


  // ===
  // LOCATION EVENTS
  // ===

  useEffect(() => {

    const handleLocationUpdated = (event) => {

      const location =
        event?.detail;

      if (!location) return;

      setCustomerLocation({
        address:
          location.address || "",

        latitude:
          typeof location.latitude === "number"
            ? location.latitude
            : null,

        longitude:
          typeof location.longitude === "number"
            ? location.longitude
            : null,

        accuracy:
          typeof location.accuracy === "number"
            ? location.accuracy
            : null,
      });
    };


    window.addEventListener(
      "eservoo-location-updated",
      handleLocationUpdated
    );


    return () => {

      window.removeEventListener(
        "eservoo-location-updated",
        handleLocationUpdated
      );

    };

  }, []);


  // ===
  // STARTUP LOCATION
  // ===

  useEffect(() => {

    let cancelled = false;

    const startLocationRequest =
      async () => {

        if (cancelled) return;

        await requestUserLocation();
      };

    startLocationRequest();

    return () => {
      cancelled = true;
    };

  }, []);


  // ===
  // APP LOADER
  // ===

  useEffect(() => {

    const timer =
      setTimeout(() => {
        setAppLoading(false);
      }, 1800);

    return () => {
      clearTimeout(timer);
    };

  }, []);


  // ===
  // CUSTOMER LOGIN EVENT
  // ===

  useEffect(() => {

    const openCustomerLogin = () => {

      const currentUser =
        getStoredUser();


      // Worker mode must never open customer login
      if (getStoredWorker()) {
        return;
      }


      if (currentUser) {

        setIsLoggedIn(true);

        localStorage.removeItem(
          "openCustomerLogin"
        );

        return;
      }


      setShowWelcome(false);
      setShowLoginRequired(false);
      setPendingWorker(null);
      setSelectedWorker(null);
      setShowLoginScreen(true);

      localStorage.removeItem(
        "openCustomerLogin"
      );
    };


    window.addEventListener(
      "open-customer-login",
      openCustomerLogin
    );


    if (
      localStorage.getItem(
        "openCustomerLogin"
      ) === "true"
    ) {
      openCustomerLogin();
    }


    return () => {

      window.removeEventListener(
        "open-customer-login",
        openCustomerLogin
      );

    };

  }, []);


  // ===
  // LANGUAGE + SENIOR MODE EVENTS
  // ===

  useEffect(() => {

    const handleLanguageChanged =
      (event) => {

        const newLanguage =
          event.detail;

        if (
          newLanguage !== "en" &&
          newLanguage !== "hi" &&
          newLanguage !== "od"
        ) {
          return;
        }

        setLanguage(newLanguage);

        localStorage.setItem(
          "language",
          newLanguage
        );

        localStorage.setItem(
          "lang",
          newLanguage
        );
      };


    const handleSeniorModeChanged =
      (event) => {

        const newValue =
          Boolean(event.detail);

        setSeniorMode(newValue);

        localStorage.setItem(
          "seniorMode",
          String(newValue)
        );
      };


    window.addEventListener(
      "language-changed",
      handleLanguageChanged
    );

    window.addEventListener(
      "senior-mode-changed",
      handleSeniorModeChanged
    );


    return () => {

      window.removeEventListener(
        "language-changed",
        handleLanguageChanged
      );

      window.removeEventListener(
        "senior-mode-changed",
        handleSeniorModeChanged
      );

    };

  }, []);


  // ===
  // CHANGE LANGUAGE
  // ===

  const changeLanguage = (lang) => {

    if (
      lang !== "en" &&
      lang !== "hi" &&
      lang !== "od"
    ) {
      return;
    }

    setLanguage(lang);

    localStorage.setItem(
      "language",
      lang
    );

    localStorage.setItem(
      "lang",
      lang
    );


    window.dispatchEvent(
      new CustomEvent(
        "language-changed",
        {
          detail: lang,
        }
      )
    );
  };


  // ===
  // WORKER SELECT
  // ===

  const handleWorkerSelect =
    (worker) => {

      // Worker cannot book another worker
      if (workerLoggedIn) {
        return;
      }


      if (!isLoggedIn) {

        setPendingWorker(worker);
        setShowLoginRequired(true);

        return;
      }


      setSelectedWorker(worker);
    };


  // ===
  // OPEN CUSTOMER LOGIN
  // ===

  const openLoginScreen = () => {

    setShowLoginRequired(false);
    setShowLoginScreen(true);

  };


  // ===
  // CUSTOMER LOGIN STATE
  // ===

  const handleCustomerLoginState =
    (value) => {

      // Do not replace worker session
      if (getStoredWorker()) {
        return;
      }

      setIsLoggedIn(Boolean(value));


      if (value) {

        setShowLoginScreen(false);


        if (pendingWorker) {

          setSelectedWorker(
            pendingWorker
          );

          setPendingWorker(null);
        }
      }
    };


  // ===
  // WORKER LOGIN STATE
  // ===

  const handleWorkerLoginState =
    (value) => {

      const loggedIn =
        Boolean(value);

      setWorkerLoggedIn(loggedIn);


      if (loggedIn) {

        // Worker mode resets customer UI
        setShowLoginScreen(false);
        setShowLoginRequired(false);

        setPendingWorker(null);
        setSelectedWorker(null);

        setShowWelcome(false);

        setIsLoggedIn(false);

        localStorage.removeItem(
          "openCustomerLogin"
        );
      }
    };


  // ===
  // LOADER
  // ===

  if (appLoading) {
    return <Loader />;
  }


  // ===
  // WORKER MODE — COMPLETE ISOLATION
  // ===
  //
  // IMPORTANT:
  // Worker dashboard returns BEFORE customer UI.
  //
  // No:
  // AIAssistant
  // Navbar
  // FooterNav
  // LoginRequiredModal
  // Customer Routes
  //
  // will render in worker mode.
  // ===

  if (workerLoggedIn) {

    return (
      <div
        data-theme="light"
        className="min-h-screen w-full bg-[#B4DBDC] text-[#08566E] overflow-x-hidden"
        style={{
          colorScheme: "only light",
          backgroundColor: "#B4DBDC",
          color: "#08566E",
        }}
      >
        <WorkerDashboard
          language={language}
        />
      </div>
    );
  }


  // ===
  // CUSTOMER AUTH SCREEN
  // ===

  if (showLoginScreen) {

    return (
      <AuthScreen
        setIsLoggedIn={
          handleCustomerLoginState
        }
        setWorkerLoggedIn={
          handleWorkerLoginState
        }
      />
    );
  }


  // ===
  // CUSTOMER APP
  // ===

  return (
    <>
      <AIAssistant
        language={language}
      />

      <div
        data-theme="light"
        className={`
          es-light-lock
          bg-[#B4DBDC]
          text-[#08566E]
          min-h-screen
          pb-32
          overflow-x-hidden
          ${seniorMode ? "senior-mode" : ""}
        `}
        style={{
          colorScheme: "only light",
          backgroundColor: "#B4DBDC",
          color: "#08566E",
        }}
      >

        <Routes>

          {/* =
              HOME
          = */}

          <Route
            path="/"
            element={
              <HomePage
                seniorMode={seniorMode}
                setSeniorMode={setSeniorMode}

                selectedService={
                  selectedService
                }

                setSelectedService={
                  setSelectedService
                }

                selectedWorker={
                  selectedWorker
                }

                setSelectedWorker={
                  setSelectedWorker
                }

                language={language}

                changeLanguage={
                  changeLanguage
                }

                showWelcome={
                  showWelcome
                }

                setShowWelcome={
                  setShowWelcome
                }

                workerLoggedIn={
                  workerLoggedIn
                }

                customerLocation={
                  customerLocation
                }

                setCustomerLocation={
                  setCustomerLocation
                }

                handleWorkerSelect={
                  handleWorkerSelect
                }
              />
            }
          />


          {/* =
              PROFILE
          = */}

          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile
                  language={language}
                />
              ) : (
                <AuthScreen
                  setIsLoggedIn={
                    handleCustomerLoginState
                  }
                  setWorkerLoggedIn={
                    handleWorkerLoginState
                  }
                />
              )
            }
          />


          {/* =
              CONTACT
          = */}

          <Route
            path="/contact"
            element={
              <Contact
                language={language}
              />
            }
          />


          {/* =
              TERMS
          = */}

          <Route
            path="/terms"
            element={
              <Terms
                language={language}
              />
            }
          />


          {/* =
              CUSTOMER DASHBOARD
          = */}

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <CustomerDashboard
                  language={language}
                  customerLocation={
                    customerLocation
                  }
                />
              ) : (
                <AuthScreen
                  setIsLoggedIn={
                    handleCustomerLoginState
                  }
                  setWorkerLoggedIn={
                    handleWorkerLoginState
                  }
                />
              )
            }
          />


          {/* =
              CUSTOMER BOOKINGS
          = */}

          <Route
            path="/bookings"
            element={
              isLoggedIn ? (
                <MyBookings
                  language={language}
                  customerLocation={
                    customerLocation
                  }
                />
              ) : (
                <AuthScreen
                  setIsLoggedIn={
                    handleCustomerLoginState
                  }
                  setWorkerLoggedIn={
                    handleWorkerLoginState
                  }
                />
              )
            }
          />


          {/* =
              REWARDS
          = */}

          <Route
            path="/rewards"
            element={
              <Rewards />
            }
          />


          {/* =
              WORKER LOGIN
          = */}

          <Route
            path="/worker-login"
            element={
              <WorkerLogin
                language={language}
                setWorkerLoggedIn={
                  handleWorkerLoginState
                }
              />
            }
          />


          {/* =
              WORKER DASHBOARD
          = */}

          <Route
            path="/worker-dashboard"
            element={
              workerLoggedIn ? (
                <WorkerDashboard
                  language={language}
                />
              ) : (
                <Navigate
                  to="/worker-login"
                  replace
                />
              )
            }
          />


          {/* =
              SERVICES / WORKERS
          = */}

          <Route
            path="/services"
            element={
              selectedWorker ? (
                <BookingForm
                  selectedWorker={
                    selectedWorker
                  }
                  setSelectedWorker={
                    setSelectedWorker
                  }
                  customerLocation={
                    customerLocation
                  }
                  setCustomerLocation={
                    setCustomerLocation
                  }
                />
              ) : (
                <Workers
                  language={language}
                  setSelectedWorker={
                    handleWorkerSelect
                  }
                  selectedService={
                    selectedService
                  }
                  customerLocation={
                    customerLocation
                  }
                />
              )
            }
          />

        </Routes>


        {/* =
            CUSTOMER FOOTER ONLY
        = */}

        {!selectedWorker &&
          !showLoginScreen && (
            <FooterNav />
          )}

      </div>


      {/* =
          LOGIN REQUIRED MODAL
      = */}

      {showLoginRequired &&
        !workerLoggedIn && (
          <LoginRequiredModal

            onClose={() => {

              setShowLoginRequired(
                false
              );

              setPendingWorker(
                null
              );

            }}

            onLogin={
              openLoginScreen
            }

          />
        )}

    </>
  );
}


export default App;