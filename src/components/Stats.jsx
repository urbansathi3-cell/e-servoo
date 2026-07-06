import { useEffect, useState } from "react";
import { translations } from "../translations";
import {
  FaUsers,
  FaTools,
  FaCalendarCheck,
  FaCheckCircle,
  FaStar,
  FaChartLine,
} from "react-icons/fa";

function Stats({ language = "en" }) {
  const t = translations[language] || translations.en;

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

  const getText = {
    liveImpact:
      language === "hi"
        ? "लाइव इम्पैक्ट"
        : language === "od"
          ? "ଲାଇଭ୍ ପ୍ରଭାବ"
          : "Live Impact",

    subtitle:
      language === "hi"
        ? "E-SERVOO के रियल टाइम प्लेटफॉर्म आंकड़े"
        : language === "od"
          ? "E-SERVOO ର real-time platform stats"
          : "Real-time platform performance of E-SERVOO",

    verifiedPros:
      language === "hi"
        ? "Verified Pros"
        : language === "od"
          ? "Verified Pros"
          : "Verified Pros",

    activeServices:
      language === "hi"
        ? "Active Categories"
        : language === "od"
          ? "Active Categories"
          : "Active Categories",

    totalBookings:
      language === "hi"
        ? "Total Requests"
        : language === "od"
          ? "Total Requests"
          : "Total Requests",

    completedJobs:
      language === "hi"
        ? "Completed Jobs"
        : language === "od"
          ? "Completed Jobs"
          : "Completed Jobs",

    satisfaction:
      language === "hi"
        ? "Satisfaction"
        : language === "od"
          ? "Satisfaction"
          : "Satisfaction",

    trustedBy:
      language === "hi"
        ? "Trusted by local users"
        : language === "od"
          ? "Local users ଙ୍କ ଭରସା"
          : "Trusted by local users",
  };

  const safeNumber = (value) => {
    const number = Number(String(value || 0).replace(/[^\d.]/g, ""));
    return Number.isNaN(number) ? 0 : number;
  };

  const animateNumbers = (targetStats) => {
    const duration = 1300;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        workers: Math.round(targetStats.workers * easeOut),
        services: Math.round(targetStats.services * easeOut),
        bookings: Math.round(targetStats.bookings * easeOut),
        completedJobs: Math.round(targetStats.completedJobs * easeOut),
        satisfaction: Math.round(targetStats.satisfaction * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?action=stats&nocache=" +
        Date.now()
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Stats Data:", data);

        const newStats = {
          workers: safeNumber(data.workers),
          services: safeNumber(data.services),
          bookings: safeNumber(data.bookings),
          completedJobs: safeNumber(data.completedJobs),
          satisfaction: safeNumber(data.satisfaction),
        };

        setStats(newStats);
        animateNumbers(newStats);
      })
      .catch((error) => {
        console.log("Stats Error:", error);
      });
  }, []);

  const statCards = [
    {
      title: t.workers || "Workers",
      subtitle: getText.verifiedPros,
      value: animatedStats.workers,
      suffix: "+",
      icon: <FaUsers />,
    },
    {
      title: t.services || "Services",
      subtitle: getText.activeServices,
      value: animatedStats.services,
      suffix: "+",
      icon: <FaTools />,
    },
    {
      title: t.bookings || "Bookings",
      subtitle: getText.totalBookings,
      value: animatedStats.bookings,
      suffix: "+",
      icon: <FaCalendarCheck />,
    },
    {
      title: getText.completedJobs,
      subtitle: "Successfully Done",
      value: animatedStats.completedJobs,
      suffix: "+",
      icon: <FaCheckCircle />,
    },
    {
      title: getText.satisfaction,
      subtitle: getText.trustedBy,
      value: animatedStats.satisfaction,
      suffix: "%",
      icon: <FaStar />,
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0]">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#08566E]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#6FA8AA]/35 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-5">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2 rounded-full shadow-lg text-[#08566E] font-extrabold mb-5">
            <FaChartLine />
            {getText.liveImpact}
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#08566E]">
            E-SERVOO Growth Stats
          </h2>

          <p className="mt-3 text-[#08566E]/75 font-semibold max-w-2xl mx-auto">
            {getText.subtitle}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white/35 backdrop-blur-xl border border-white/60 rounded-[28px] p-5 text-center shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-[#08566E]"></div>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition duration-300">
                {item.icon}
              </div>

              <h3 className="mt-5 text-4xl font-black text-[#08566E]">
                {item.value}
                <span className="text-[#0A6F78]">
                  {item.suffix}
                </span>
              </h3>

              <p className="mt-2 text-[#08566E] font-extrabold">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-[#08566E]/65 font-bold">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM TRUST LINE */}
        <div className="mt-10 bg-[#08566E] rounded-[28px] p-6 text-center shadow-2xl">
          <p className="text-[#E1E9E5] text-lg md:text-xl font-extrabold">
            ⚡ Smart Matching • Verified Workers • Inspection Based Pricing • Fast Local Booking
          </p>
        </div>

      </div>
    </section>
  );
}

export default Stats;