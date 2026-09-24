import { useEffect, useState } from "react";
import {
  FaUsers,
  FaTools,
  FaCalendarCheck,
  FaCheckCircle,
  FaStar,
  FaChartLine,
} from "react-icons/fa";

function Stats({ language = "en" }) {
  // =====
  // LANGUAGE TEXT
  // =====

  const text = {
    en: {
      badge: "Live Impact",
      title: "E-SERVOO at a Glance",
      subtitle:
        "Real-time platform performance and service network growth.",
      workers: "Verified Pros",
      workersSub: "Trusted professionals",
      services: "Services",
      servicesSub: "Active categories",
      bookings: "Bookings",
      bookingsSub: "Service requests",
      completed: "Completed",
      completedSub: "Successfully done",
      satisfaction: "Satisfaction",
      satisfactionSub: "User experience",
      trust:
        "Verified Workers • Smart Matching • Inspection-Based Pricing",
    },

    hi: {
      badge: "लाइव इम्पैक्ट",
      title: "E-SERVOO एक नज़र में",
      subtitle:
        "प्लेटफॉर्म की रियल-टाइम परफॉर्मेंस और सर्विस नेटवर्क ग्रोथ।",
      workers: "Verified Pros",
      workersSub: "भरोसेमंद प्रोफेशनल्स",
      services: "Services",
      servicesSub: "Active categories",
      bookings: "Bookings",
      bookingsSub: "Service requests",
      completed: "Completed",
      completedSub: "Successfully done",
      satisfaction: "Satisfaction",
      satisfactionSub: "User experience",
      trust:
        "Verified Workers • Smart Matching • Inspection-Based Pricing",
    },

    od: {
      badge: "ଲାଇଭ୍ ପ୍ରଭାବ",
      title: "E-SERVOO ଏକ ନଜରରେ",
      subtitle:
        "ପ୍ଲାଟଫର୍ମର real-time performance ଏବଂ service network growth।",
      workers: "Verified Pros",
      workersSub: "ଭରସାଯୋଗ୍ୟ professionals",
      services: "Services",
      servicesSub: "Active categories",
      bookings: "Bookings",
      bookingsSub: "Service requests",
      completed: "Completed",
      completedSub: "Successfully done",
      satisfaction: "Satisfaction",
      satisfactionSub: "User experience",
      trust:
        "Verified Workers • Smart Matching • Inspection-Based Pricing",
    },
  };

  const t = text[language] || text.en;


  // =====
  // STATS STATE
  // =====

  const [stats, setStats] = useState({
    workers: 0,
    services: 0,
    bookings: 0,
    completedJobs: 0,
    satisfaction: 0,
  });


  const [animatedStats, setAnimatedStats] = useState({
    workers: 0,
    services: 0,
    bookings: 0,
    completedJobs: 0,
    satisfaction: 0,
  });


  // =====
  // SAFE NUMBER
  // =====

  const safeNumber = (value) => {
    if (value === null || value === undefined) {
      return 0;
    }

    const number = Number(
      String(value).replace(/[^\d.]/g, "")
    );

    return Number.isNaN(number) ? 0 : number;
  };


  // =====
  // NUMBER ANIMATION
  // =====

  const animateNumbers = (targetStats) => {
    const duration = 1100;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easeOut =
        1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        workers: Math.round(
          targetStats.workers * easeOut
        ),

        services: Math.round(
          targetStats.services * easeOut
        ),

        bookings: Math.round(
          targetStats.bookings * easeOut
        ),

        completedJobs: Math.round(
          targetStats.completedJobs * easeOut
        ),

        satisfaction: Math.round(
          targetStats.satisfaction * easeOut
        ),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };


  // =====
  // FETCH STATS
  // =====

  useEffect(() => {
    let cancelled = false;

    const API_URL =
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

    const loadStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}?action=stats&nocache=${Date.now()}`
        );

        // --------------------------------------------------
        // IMPORTANT:
        // Don't blindly call response.json().
        // Apps Script 404 can return HTML.
        // --------------------------------------------------

        const contentType =
          response.headers.get("content-type") || "";

        if (!response.ok) {
          throw new Error(
            `Stats API HTTP ${response.status}`
          );
        }

        if (!contentType.includes("application/json")) {
          const rawText = await response.text();

          console.warn(
            "Stats API returned non-JSON response:",
            rawText.slice(0, 200)
          );

          throw new Error(
            "Stats API did not return JSON"
          );
        }

        const data = await response.json();

        if (cancelled) return;

        console.log("Stats Data:", data);

        const newStats = {
          workers: safeNumber(data.workers),
          services: safeNumber(data.services),
          bookings: safeNumber(data.bookings),
          completedJobs: safeNumber(
            data.completedJobs
          ),
          satisfaction: safeNumber(
            data.satisfaction
          ),
        };

        setStats(newStats);

        animateNumbers(newStats);

      } catch (error) {
        if (cancelled) return;

        console.warn(
          "Stats could not be loaded:",
          error.message
        );

        // Keep UI stable even if API fails.
        const fallbackStats = {
          workers: 0,
          services: 0,
          bookings: 0,
          completedJobs: 0,
          satisfaction: 0,
        };

        setStats(fallbackStats);
        setAnimatedStats(fallbackStats);
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);


  // =====
  // STAT CARDS
  // =====

  const statCards = [
    {
      title: t.workers,
      subtitle: t.workersSub,
      value: animatedStats.workers,
      suffix: "+",
      icon: <FaUsers />,
    },

    {
      title: t.services,
      subtitle: t.servicesSub,
      value: animatedStats.services,
      suffix: "+",
      icon: <FaTools />,
    },

    {
      title: t.bookings,
      subtitle: t.bookingsSub,
      value: animatedStats.bookings,
      suffix: "+",
      icon: <FaCalendarCheck />,
    },

    {
      title: t.completed,
      subtitle: t.completedSub,
      value: animatedStats.completedJobs,
      suffix: "+",
      icon: <FaCheckCircle />,
    },

    {
      title: t.satisfaction,
      subtitle: t.satisfactionSub,
      value: animatedStats.satisfaction,
      suffix: "%",
      icon: <FaStar />,
    },
  ];


  // =====
  // UI
  // =====

  return (
    <section className="relative bg-[#E1E9E5] py-14 sm:py-16 overflow-hidden">

      {/* =
          SUBTLE BACKGROUND
      = */}

      <div className="absolute top-0 left-0 w-56 h-56 bg-[#B4DBDC]/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#9ECFD0]/45 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />


      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">


        {/* =
            HEADER
        = */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

          <div>

            {/* BADGE */}

            <div className="inline-flex items-center gap-2 mb-3">

              <div
                className="
                  w-8 h-8
                  rounded-full
                  bg-[#08566E]
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <FaChartLine size={12} />
              </div>

              <span
                className="
                  text-[10px]
                  sm:text-xs
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-[#08566E]
                "
              >
                {t.badge}
              </span>

            </div>


            {/* TITLE */}

            <h2
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-black
                tracking-tight
                text-[#08566E]
              "
            >
              {t.title}
            </h2>


            {/* SUBTITLE */}

            <p
              className="
                mt-2
                text-sm
                sm:text-base
                text-[#08566E]/65
                font-semibold
                max-w-xl
              "
            >
              {t.subtitle}
            </p>

          </div>


          {/* LIVE INDICATOR */}

          <div
            className="
              self-start
              sm:self-auto
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-full
              bg-white
              border
              border-[#B4DBDC]
              shadow-sm
            "
          >

            <span className="relative flex h-2.5 w-2.5">

              <span
                className="
                  animate-ping
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  bg-[#6FA8AA]
                  opacity-75
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  rounded-full
                  h-2.5
                  w-2.5
                  bg-[#08566E]
                "
              />

            </span>

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-[#08566E]
              "
            >
              Live Data
            </span>

          </div>

        </div>


        {/* =
            STATS GRID
        = */}

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-5
            gap-3
            sm:gap-4
          "
        >

          {statCards.map((item, index) => (

            <div
              key={index}
              className="
                group
                bg-white
                border
                border-[#6FA8AA]/25
                rounded-[20px]
                p-4
                sm:p-5
                shadow-[0_5px_18px_rgba(8,86,110,0.07)]
                hover:-translate-y-1
                hover:shadow-[0_10px_25px_rgba(8,86,110,0.12)]
                transition-all
                duration-300
              "
            >

              {/* ICON + MINI LINE */}

              <div className="flex items-center justify-between">

                <div
                  className="
                    w-9
                    h-9
                    sm:w-10
                    sm:h-10
                    rounded-xl
                    bg-[#08566E]
                    text-[#E1E9E5]
                    flex
                    items-center
                    justify-center
                    text-sm
                    sm:text-base
                    group-hover:scale-105
                    transition
                  "
                >
                  {item.icon}
                </div>

                <div
                  className="
                    w-8
                    h-1
                    rounded-full
                    bg-[#B4DBDC]
                  "
                />

              </div>


              {/* NUMBER */}

              <div
                className="
                  mt-5
                  text-2xl
                  sm:text-3xl
                  font-black
                  tracking-tight
                  text-[#08566E]
                "
              >
                {item.value}
                <span className="text-[#0A6F78]">
                  {item.suffix}
                </span>
              </div>


              {/* TITLE */}

              <p
                className="
                  mt-1
                  text-xs
                  sm:text-sm
                  font-black
                  text-[#08566E]
                "
              >
                {item.title}
              </p>


              {/* SUBTITLE */}

              <p
                className="
                  mt-1
                  text-[9px]
                  sm:text-[10px]
                  leading-tight
                  text-[#08566E]/55
                  font-semibold
                "
              >
                {item.subtitle}
              </p>

            </div>

          ))}

        </div>


        {/* =
            TRUST STRIP
        = */}

        <div
          className="
            mt-5
            bg-[#08566E]
            rounded-[20px]
            px-4
            py-4
            sm:px-6
            sm:py-4
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-2
            text-center
          "
        >

          <FaCheckCircle
            className="text-[#B4DBDC] flex-shrink-0"
            size={14}
          />

          <p
            className="
              text-[#E1E9E5]
              text-[10px]
              sm:text-xs
              font-bold
              leading-relaxed
            "
          >
            {t.trust}
          </p>

        </div>

      </div>

    </section>
  );
}

export default Stats;