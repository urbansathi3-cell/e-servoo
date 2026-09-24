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

function TopCommandBar({
  language,
  changeLanguage,
  seniorMode,
  setSeniorMode,
}) {
  const langButtons = [
    { id: "en", label: "EN" },
    { id: "hi", label: "HI" },
    { id: "od", label: "OD" },
  ];

  return (
    <div className="sticky top-[72px] z-30 px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-[#E1E9E5]/85 backdrop-blur-xl border border-white/80 shadow-2xl">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#9ECFD0] rounded-full blur-2xl opacity-70" />

          <div className="absolute -bottom-14 -right-12 w-40 h-40 bg-[#6FA8AA] rounded-full blur-2xl opacity-50" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
            <div>
              <p className="text-[#08566E] text-sm font-black">
                ⚡ Quick Controls
              </p>

              <p className="text-[#06485C] text-xs md:text-sm font-bold mt-1">
                Choose language and accessibility mode instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2 bg-white/70 border border-[#B4DBDC] rounded-2xl p-2 shadow-md">
                <span className="text-[#08566E] font-black text-sm px-2">
                  🌐
                </span>

                {langButtons.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => changeLanguage(item.id)}
                    className={`px-4 py-2 rounded-xl font-black text-sm transition ${
                      language === item.id
                        ? "bg-[#08566E] text-[#E1E9E5] shadow-lg"
                        : "bg-transparent text-[#08566E] hover:bg-[#B4DBDC]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSeniorMode(!seniorMode)}
                className={`px-5 py-3 rounded-2xl font-black shadow-lg transition ${
                  seniorMode
                    ? "bg-[#08566E] text-[#E1E9E5]"
                    : "bg-[#F6F8F7] text-[#08566E] border border-[#6FA8AA]"
                }`}
              >
                👴 {seniorMode ? "Normal Mode" : "Senior Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            Worker booking ke liye pehle customer login required hai. Login
            ke baad selected worker ka booking form automatically open ho
            jayega.
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

function HomePage({
  seniorMode,
  setSeniorMode,
  setSelectedService,
  selectedWorker,
  setSelectedWorker,
  language,
  changeLanguage,
  showWelcome,
  setShowWelcome,
  workerLoggedIn,
  customerLocation,
  setCustomerLocation,
}) {
  /*
   * ============================================================
   * WORKER MODE
   * ============================================================
   *
   * This is an additional safety layer.
   *
   * App.jsx already handles worker mode globally,
   * but keeping this check here makes HomePage safe too.
   */

  if (workerLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#B4DBDC]">
        <WorkerDashboard language={language} />
      </div>
    );
  }

  if (showWelcome) {
    return <Welcome setShowWelcome={setShowWelcome} />;
  }

  return (
    <>
      <Navbar />

      {selectedWorker ? (
        <BookingForm
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
          customerLocation={customerLocation}
          setCustomerLocation={setCustomerLocation}
        />
      ) : (
        <>
          <RevealOnScroll delay={0}>
            <TopCommandBar
              language={language}
              changeLanguage={changeLanguage}
              seniorMode={seniorMode}
              setSeniorMode={setSeniorMode}
            />
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <Hero
              language={language}
              customerLocation={customerLocation}
              setCustomerLocation={setCustomerLocation}
            />
          </RevealOnScroll>

          <RevealOnScroll delay={180}>
            <Stats />
          </RevealOnScroll>

          <RevealOnScroll delay={240}>
            <WorkerOfMonth language={language} />
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <Services
              language={language}
              setSelectedService={setSelectedService}
            />
          </RevealOnScroll>

          <RevealOnScroll delay={360}>
            <WhatsappButton />
          </RevealOnScroll>
        </>
      )}
    </>
  );
}

function App() {
  const savedUser = getStoredUser();
  const savedWorker = getStoredWorker();

  const [appLoading, setAppLoading] = useState(true);

  const [selectedService, setSelectedService] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [pendingWorker, setPendingWorker] = useState(null);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(savedUser);
  });

  const [workerLoggedIn, setWorkerLoggedIn] = useState(() => {
    return Boolean(savedWorker);
  });

  const [seniorMode, setSeniorMode] = useState(false);

  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("lang");

    if (
      savedLang === "en" ||
      savedLang === "hi" ||
      savedLang === "od"
    ) {
      return savedLang;
    }

    localStorage.setItem("lang", "en");
    return "en";
  });

  /*
   * ============================================================
   * CUSTOMER LOCATION
   * ============================================================
   */

  const [customerLocation, setCustomerLocation] = useState(() => {
    try {
      const savedLocation = localStorage.getItem(
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

      const parsed = JSON.parse(savedLocation);

      if (
        typeof parsed !== "object" ||
        parsed === null
      ) {
        throw new Error("Invalid saved location");
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

  /*
   * Save customer location locally.
   */

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

  /*
   * Listen for location updates.
   */

  useEffect(() => {
    const handleLocationUpdated = (event) => {
      const location = event?.detail;

      if (!location) return;

      setCustomerLocation({
        address: location.address || "",
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

  /*
   * ============================================================
   * APP LOADING
   * ============================================================
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  /*
   * ============================================================
   * CUSTOMER LOGIN EVENT
   * ============================================================
   */

  useEffect(() => {
    const openCustomerLogin = () => {
      const currentUser = getStoredUser();

      /*
       * IMPORTANT:
       * Worker mode should never open customer login.
       */
      if (getStoredWorker()) {
        return;
      }

      if (currentUser) {
        setIsLoggedIn(true);
        localStorage.removeItem("openCustomerLogin");
        return;
      }

      setShowWelcome(false);
      setShowLoginRequired(false);
      setPendingWorker(null);
      setSelectedWorker(null);
      setShowLoginScreen(true);

      localStorage.removeItem("openCustomerLogin");
    };

    window.addEventListener(
      "open-customer-login",
      openCustomerLogin
    );

    if (
      localStorage.getItem("openCustomerLogin") === "true"
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

  /*
   * ============================================================
   * LANGUAGE
   * ============================================================
   */

  const changeLanguage = (lang) => {
    if (
      lang !== "en" &&
      lang !== "hi" &&
      lang !== "od"
    ) {
      return;
    }

    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  /*
   * ============================================================
   * WORKER SELECTION
   * ============================================================
   */

  const handleWorkerSelect = (worker) => {
    /*
     * Worker cannot book another worker.
     */
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

  /*
   * ============================================================
   * CUSTOMER LOGIN SCREEN
   * ============================================================
   */

  const openLoginScreen = () => {
    setShowLoginRequired(false);
    setShowLoginScreen(true);
  };

  /*
   * ============================================================
   * CUSTOMER LOGIN STATE
   * ============================================================
   */

  const handleCustomerLoginState = (value) => {
    /*
     * Never allow customer login state to replace
     * an already authenticated worker session.
     */
    if (getStoredWorker()) {
      return;
    }

    setIsLoggedIn(value);

    if (value) {
      setShowLoginScreen(false);

      if (pendingWorker) {
        setSelectedWorker(pendingWorker);
        setPendingWorker(null);
      }
    }
  };

  /*
   * ============================================================
   * WORKER LOGIN STATE
   * ============================================================
   */

  const handleWorkerLoginState = (value) => {
    setWorkerLoggedIn(Boolean(value));

    if (value) {
      /*
       * WORKER MODE RESET
       *
       * Remove every customer-only UI state.
       */
      setShowLoginScreen(false);
      setShowLoginRequired(false);

      setPendingWorker(null);
      setSelectedWorker(null);

      setShowWelcome(false);

      /*
       * Customer state is intentionally not used
       * while worker mode is active.
       */
      setIsLoggedIn(false);

      /*
       * Make sure customer login trigger cannot
       * reopen immediately after worker login.
       */
      localStorage.removeItem("openCustomerLogin");
    }
  };

  /*
   * ============================================================
   * LOADER
   * ============================================================
   */

  if (appLoading) {
    return <Loader />;
  }

  /*
   * ============================================================
   * WORKER MODE — COMPLETE ISOLATION
   * ============================================================
   *
   * THIS IS THE MAIN FIX.
   *
   * If worker is logged in, we return here BEFORE:
   *
   * AIAssistant
   * Navbar
   * Routes
   * FooterNav
   * LoginRequiredModal
   * Customer UI
   *
   * can render.
   */

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

  /*
   * ============================================================
   * CUSTOMER AUTH SCREEN
   * ============================================================
   */

  if (showLoginScreen) {
    return (
      <AuthScreen
        setIsLoggedIn={handleCustomerLoginState}
        setWorkerLoggedIn={handleWorkerLoginState}
      />
    );
  }

  /*
   * ============================================================
   * CUSTOMER APP
   * ============================================================
   */

  return (
    <>
      <AIAssistant language={language} />

      <div
        data-theme="light"
        className={`es-light-lock bg-[#B4DBDC] text-[#08566E] min-h-screen pb-32 overflow-x-hidden ${
          seniorMode ? "senior-mode" : ""
        }`}
        style={{
          colorScheme: "only light",
          backgroundColor: "#B4DBDC",
          color: "#08566E",
        }}
      >
        <Routes>
          {/* ================================================= */}
          {/* HOME */}
          {/* ================================================= */}

          <Route
            path="/"
            element={
              <HomePage
                seniorMode={seniorMode}
                setSeniorMode={setSeniorMode}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                selectedWorker={selectedWorker}
                setSelectedWorker={setSelectedWorker}
                language={language}
                changeLanguage={changeLanguage}
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
                workerLoggedIn={workerLoggedIn}
                customerLocation={customerLocation}
                setCustomerLocation={setCustomerLocation}
              />
            }
          />

          {/* ================================================= */}
          {/* CUSTOMER PROFILE */}
          {/* ================================================= */}

          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile language={language} />
              ) : (
                <AuthScreen
                  setIsLoggedIn={handleCustomerLoginState}
                  setWorkerLoggedIn={handleWorkerLoginState}
                />
              )
            }
          />

          {/* ================================================= */}
          {/* CONTACT */}
          {/* ================================================= */}

          <Route
            path="/contact"
            element={<Contact language={language} />}
          />

          {/* ================================================= */}
          {/* TERMS */}
          {/* ================================================= */}

          <Route
            path="/terms"
            element={<Terms language={language} />}
          />

          {/* ================================================= */}
          {/* CUSTOMER DASHBOARD */}
          {/* ================================================= */}

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <CustomerDashboard
                  language={language}
                  customerLocation={customerLocation}
                />
              ) : (
                <AuthScreen
                  setIsLoggedIn={handleCustomerLoginState}
                  setWorkerLoggedIn={handleWorkerLoginState}
                />
              )
            }
          />

          {/* ================================================= */}
          {/* CUSTOMER BOOKINGS */}
          {/* ================================================= */}

          <Route
            path="/bookings"
            element={
              isLoggedIn ? (
                <MyBookings
                  language={language}
                  customerLocation={customerLocation}
                />
              ) : (
                <AuthScreen
                  setIsLoggedIn={handleCustomerLoginState}
                  setWorkerLoggedIn={handleWorkerLoginState}
                />
              )
            }
          />

          {/* ================================================= */}
          {/* REWARDS */}
          {/* ================================================= */}

          <Route
            path="/rewards"
            element={<Rewards />}
          />

          {/* ================================================= */}
          {/* WORKER LOGIN */}
          {/* ================================================= */}

          <Route
            path="/worker-login"
            element={
              <WorkerLogin
                language={language}
                setWorkerLoggedIn={handleWorkerLoginState}
              />
            }
          />

          {/* ================================================= */}
          {/* WORKER DASHBOARD */}
          {/* ================================================= */}

          <Route
            path="/worker-dashboard"
            element={
              workerLoggedIn ? (
                <WorkerDashboard language={language} />
              ) : (
                <Navigate
                  to="/worker-login"
                  replace
                />
              )
            }
          />

          {/* ================================================= */}
          {/* SERVICES / WORKERS */}
          {/* ================================================= */}

          <Route
            path="/services"
            element={
              selectedWorker ? (
                <BookingForm
                  selectedWorker={selectedWorker}
                  setSelectedWorker={setSelectedWorker}
                  customerLocation={customerLocation}
                  setCustomerLocation={setCustomerLocation}
                />
              ) : (
                <Workers
                  language={language}
                  setSelectedWorker={handleWorkerSelect}
                  selectedService={selectedService}
                  customerLocation={customerLocation}
                />
              )
            }
          />
        </Routes>

        {/* =================================================== */}
        {/* CUSTOMER FOOTER ONLY */}
        {/* =================================================== */}

        {!selectedWorker && !showLoginScreen && (
          <FooterNav />
        )}
      </div>

      {/* ===================================================== */}
      {/* CUSTOMER LOGIN REQUIRED MODAL ONLY */}
      {/* ===================================================== */}

      {showLoginRequired && !workerLoggedIn && (
        <LoginRequiredModal
          onClose={() => {
            setShowLoginRequired(false);
            setPendingWorker(null);
          }}
          onLogin={openLoginScreen}
        />
      )}
    </>
  );
}

export default App;