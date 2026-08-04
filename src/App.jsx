import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#9ECFD0] rounded-full blur-2xl opacity-70"></div>
          <div className="absolute -bottom-14 -right-12 w-40 h-40 bg-[#6FA8AA] rounded-full blur-2xl opacity-50"></div>

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
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#9ECFD0] rounded-full blur-3xl opacity-80"></div>
        <div className="absolute -bottom-20 -right-16 w-52 h-52 bg-[#6FA8AA] rounded-full blur-3xl opacity-70"></div>

        <div className="relative p-7 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-4xl shadow-xl">
            🔐
          </div>

          <h2 className="text-[#043A4A] text-3xl font-black mt-5">
            Login First
          </h2>

          <p className="text-[#08566E] font-bold mt-3 leading-relaxed">
            Worker booking ke liye pehle customer login required hai. Login ke
            baad selected worker ka booking form automatically open ho jayega.
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
}) {
  if (showWelcome) {
    return <Welcome setShowWelcome={setShowWelcome} />;
  }

  if (workerLoggedIn) {
    return <WorkerDashboard language={language} />;
  }

  return (
    <>
      <Navbar />

      {selectedWorker ? (
        <BookingForm
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
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
            <Hero language={language} />
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

    if (savedLang === "en" || savedLang === "hi" || savedLang === "od") {
      return savedLang;
    }

    localStorage.setItem("lang", "en");
    return "en";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const openCustomerLogin = () => {
      const currentUser = getStoredUser();

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

    window.addEventListener("open-customer-login", openCustomerLogin);

    if (localStorage.getItem("openCustomerLogin") === "true") {
      openCustomerLogin();
    }

    return () => {
      window.removeEventListener("open-customer-login", openCustomerLogin);
    };
  }, []);

  const changeLanguage = (lang) => {
    if (lang !== "en" && lang !== "hi" && lang !== "od") return;

    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleWorkerSelect = (worker) => {
    if (!isLoggedIn) {
      setPendingWorker(worker);
      setShowLoginRequired(true);
      return;
    }

    setSelectedWorker(worker);
  };

  const openLoginScreen = () => {
    setShowLoginRequired(false);
    setShowLoginScreen(true);
  };

  const handleCustomerLoginState = (value) => {
    setIsLoggedIn(value);

    if (value) {
      setShowLoginScreen(false);

      if (pendingWorker) {
        setSelectedWorker(pendingWorker);
        setPendingWorker(null);
      }
    }
  };

  const handleWorkerLoginState = (value) => {
    setWorkerLoggedIn(value);

    if (value) {
      setShowLoginScreen(false);
      setShowLoginRequired(false);
      setPendingWorker(null);
      setSelectedWorker(null);
    }
  };

  if (appLoading) {
    return <Loader />;
  }

  if (showLoginScreen) {
    return (
      <AuthScreen
        setIsLoggedIn={handleCustomerLoginState}
        setWorkerLoggedIn={handleWorkerLoginState}
      />
    );
  }

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
              />
            }
          />

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

          <Route path="/contact" element={<Contact language={language} />} />

          <Route path="/terms" element={<Terms language={language} />} />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <CustomerDashboard language={language} />
              ) : (
                <AuthScreen
                  setIsLoggedIn={handleCustomerLoginState}
                  setWorkerLoggedIn={handleWorkerLoginState}
                />
              )
            }
          />

          <Route
            path="/bookings"
            element={
              isLoggedIn ? (
                <MyBookings language={language} />
              ) : (
                <AuthScreen
                  setIsLoggedIn={handleCustomerLoginState}
                  setWorkerLoggedIn={handleWorkerLoginState}
                />
              )
            }
          />

          <Route
            path="/worker-login"
            element={
              <WorkerLogin
                language={language}
                setWorkerLoggedIn={handleWorkerLoginState}
              />
            }
          />

          <Route
            path="/worker-dashboard"
            element={<WorkerDashboard language={language} />}
          />

          <Route
            path="/services"
            element={
              selectedWorker ? (
                <BookingForm
                  selectedWorker={selectedWorker}
                  setSelectedWorker={setSelectedWorker}
                />
              ) : (
                <Workers
                  language={language}
                  setSelectedWorker={handleWorkerSelect}
                  selectedService={selectedService}
                />
              )
            }
          />
        </Routes>

        {!selectedWorker && !showLoginScreen && <FooterNav />}
      </div>

      {showLoginRequired && (
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