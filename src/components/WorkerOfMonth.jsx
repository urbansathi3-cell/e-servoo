import { useEffect, useState } from "react";
import { translations } from "../translations";
import {
  FaStar,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaUserCheck,
} from "react-icons/fa";

function WorkerOfMonth({ language = "en" }) {
  const t = translations[language] || translations.en;

  const [bestWorker, setBestWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

  const text = {
    badge:
      language === "hi"
        ? "महीने का सर्वश्रेष्ठ वर्कर"
        : language === "od"
          ? "ମାସର ସର୍ବଶ୍ରେଷ୍ଠ Worker"
          : "Worker of the Month",

    title:
      language === "hi"
        ? "E-SERVOO Top Performer"
        : language === "od"
          ? "E-SERVOO Top Performer"
          : "E-SERVOO Top Performer",

    workerId: "Worker ID",

    verified:
      t.verifiedProfessional || "Verified",

    name:
      language === "hi"
        ? "Name"
        : language === "od"
          ? "ନାମ"
          : "Name",

    service:
      language === "hi"
        ? "Service"
        : language === "od"
          ? "ସେବା"
          : "Service",

    rating: t.ratingLabel || "Rating",

    trust: t.trust || "Trust",

    area: t.localArea || "Area",

    noData:
      language === "hi"
        ? "Worker data जल्द ही update होगा"
        : language === "od"
          ? "Worker data ଶୀଘ୍ର update ହେବ"
          : "Worker data will update soon",
  };

  // ====
  // HELPERS
  // ====

  const getValue = (obj, keys, fallback = "") => {
    for (const key of keys) {
      if (
        obj?.[key] !== undefined &&
        obj?.[key] !== null &&
        obj?.[key] !== ""
      ) {
        return obj[key];
      }
    }

    return fallback;
  };

  const toNumber = (value, fallback = 0) => {
    const num = parseFloat(
      String(value || "").replace(/[^\d.]/g, "")
    );

    return Number.isNaN(num) ? fallback : num;
  };

  const normalizeWorker = (worker) => {
    return {
      id: getValue(
        worker,
        [
          "WorkerId",
          "WorkerID",
          "Worker id",
          "workerId",
          "id",
        ],
        ""
      ),

      name: getValue(
        worker,
        ["name", "Name"],
        ""
      ),

      service: getValue(
        worker,
        ["service", "Service"],
        ""
      ),

      rating: toNumber(
        getValue(
          worker,
          ["rating", "Rating"],
          0
        )
      ),

      trustScore: toNumber(
        getValue(
          worker,
          [
            "TrustScore",
            "trustScore",
            "Trust Score",
          ],
          0
        )
      ),

      location: getValue(
        worker,
        ["location", "Location"],
        "Local Area"
      ),

      image: getValue(
        worker,
        ["image", "Image"],
        ""
      ),

      status: getValue(
        worker,
        ["status", "Status"],
        "Available"
      ),

      verified: getValue(
        worker,
        ["Verified", "verified"],
        "Yes"
      ),

      certificate: getValue(
        worker,
        [
          "CertificateLink",
          "certificateLink",
          "Certificate Link",
        ],
        ""
      ),
    };
  };

  // ====
  // SERVICE NAME
  // ====

  const getServiceText = (service) => {
    const value = String(service || "")
      .trim()
      .toLowerCase();

    if (value === "electrician")
      return t.electrician || service;

    if (value === "plumber")
      return t.plumber || service;

    if (value === "carpenter")
      return t.carpenter || service;

    if (value === "cleaner")
      return t.cleaner || service;

    if (value === "cook")
      return t.cook || service;

    if (value === "painter")
      return t.painter || service;

    if (value === "ac repair")
      return t.acRepair || service;

    if (value === "home tutor")
      return t.tutor || service;

    if (value === "appliance repair")
      return t.applianceRepair || service;

    if (value === "cctv service")
      return t.cctvService || service;

    return service || "Service Expert";
  };

  // ====
  // FETCH WORKER
  // ====

  useEffect(() => {
    const fetchTopWorker = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}?nocache=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data) || !data.length) {
          setBestWorker(null);
          return;
        }

        const workers = data
          .map(normalizeWorker)
          .filter(
            (worker) =>
              worker.name || worker.service
          );

        if (!workers.length) {
          setBestWorker(null);
          return;
        }

        const sorted = workers.sort((a, b) => {
          const scoreA =
            a.rating * 20 + a.trustScore;

          const scoreB =
            b.rating * 20 + b.trustScore;

          return scoreB - scoreA;
        });

        setBestWorker(sorted[0]);
      } catch (error) {
        console.log(
          "Worker of Month Error:",
          error
        );

        setBestWorker(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopWorker();
  }, []);

  // ====
  // LOADING
  // ====

  if (loading) {
    return (
      <section className="bg-[#E1E9E5] px-4 py-8">

        <div
          className="
            w-full
            max-w-[393px]
            aspect-[9/16]
            mx-auto
            bg-white
            rounded-[28px]
            border
            border-[#6FA8AA]/30
            p-5
            animate-pulse
          "
        >

          <div className="h-6 w-48 bg-[#B4DBDC] rounded-full" />

          <div className="h-8 w-64 bg-[#B4DBDC] rounded-lg mt-5" />

          <div className="flex justify-between mt-7">
            <div className="h-7 w-28 bg-[#B4DBDC] rounded-lg" />
            <div className="h-7 w-24 bg-[#B4DBDC] rounded-lg" />
          </div>

          <div className="grid grid-cols-[1fr_145px] gap-4 mt-7">

            <div>
              <div className="h-4 w-16 bg-[#B4DBDC] rounded" />
              <div className="h-9 w-36 bg-[#B4DBDC] rounded mt-2" />

              <div className="h-4 w-20 bg-[#B4DBDC] rounded mt-6" />
              <div className="h-7 w-28 bg-[#B4DBDC] rounded mt-2" />
            </div>

            <div className="aspect-square bg-[#B4DBDC] rounded-[22px]" />

          </div>

          <div className="grid grid-cols-3 gap-2 mt-7">
            <div className="h-20 bg-[#B4DBDC] rounded-xl" />
            <div className="h-20 bg-[#B4DBDC] rounded-xl" />
            <div className="h-20 bg-[#B4DBDC] rounded-xl" />
          </div>

        </div>
      </section>
    );
  }

  const worker = bestWorker;

  // ====
  // MAIN UI
  // ====

  return (
    <section className="bg-[#E1E9E5] px-4 py-8">

      {/* 9:16 MOBILE DESIGN */}
      <div
        className="
          relative
          w-full
          max-w-[393px]
          aspect-[9/16]
          mx-auto
          overflow-hidden
          bg-[#E1E9E5]
          rounded-[28px]
          border-2
          border-[#08566E]
          shadow-[0_10px_30px_rgba(8,86,110,0.14)]
        "
      >

        {/* BACKGROUND */}

        <div
          className="
            absolute
            -top-20
            -right-20
            w-48
            h-48
            rounded-full
            bg-[#B4DBDC]/60
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-80px]
            left-[-60px]
            w-48
            h-48
            rounded-full
            bg-[#9ECFD0]/50
            blur-3xl
          "
        />

        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            h-full
            overflow-y-auto
            px-5
            py-5
          "
        >

          {/* 
              BADGE
           */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-white
              border
              border-[#6FA8AA]/40
              text-[#08566E]
              text-[9px]
              font-black
              uppercase
              tracking-wide
            "
          >
            <FaTrophy size={10} />

            {text.badge}
          </div>


          {/* 
              TITLE
           */}

          <h2
            className="
              mt-4
              text-[25px]
              leading-tight
              font-black
              text-[#08566E]
            "
          >
            {text.title}
          </h2>


          {/* 
              WORKER ID + VERIFIED
           */}

          {worker && (
            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                mt-6
              "
            >

              <div
                className="
                  px-3
                  py-1.5
                  rounded-lg
                  bg-[#08566E]
                  text-white
                  text-[8px]
                  font-black
                  whitespace-nowrap
                "
              >
                {text.workerId}:{" "}
                {worker.id || "TOP"}
              </div>


              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-lg
                  bg-white
                  border
                  border-[#6FA8AA]/40
                  text-[#08566E]
                  text-[8px]
                  font-black
                  whitespace-nowrap
                "
              >
                <FaUserCheck size={9} />

                {text.verified}
              </div>

            </div>
          )}


          {/* 
              WORKER INFORMATION + PHOTO
           */}

          {!worker ? (

            <div
              className="
                mt-10
                bg-white
                rounded-2xl
                p-6
                text-center
                border
                border-[#6FA8AA]/30
              "
            >
              <FaTrophy
                className="
                  mx-auto
                  text-[#08566E]
                "
                size={35}
              />

              <p
                className="
                  mt-4
                  text-lg
                  font-black
                  text-[#08566E]
                "
              >
                {text.noData}
              </p>
            </div>

          ) : (

            <>

              <div
                className="
                  grid
                  grid-cols-[1fr_145px]
                  gap-4
                  items-start
                  mt-7
                "
              >

                {/* LEFT SIDE */}

                <div className="min-w-0">

                  {/* NAME */}

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      font-black
                      text-[#6FA8AA]
                    "
                  >
                    {text.name}
                  </p>


                  <h3
                    className="
                      mt-1
                      text-[25px]
                      leading-tight
                      font-black
                      text-[#08566E]
                      break-words
                    "
                  >
                    {worker.name || "Top Worker"}
                  </h3>


                  {/* SERVICE */}

                  <p
                    className="
                      mt-5
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      font-black
                      text-[#6FA8AA]
                    "
                  >
                    {text.service}
                  </p>


                  <p
                    className="
                      mt-1
                      text-[16px]
                      leading-tight
                      font-black
                      text-[#0A6F78]
                    "
                  >
                    {getServiceText(
                      worker.service
                    )}
                  </p>

                </div>


                {/* RIGHT PHOTO */}

                <div
                  className="
                    relative
                    w-full
                    aspect-square
                  "
                >

                  <div
                    className="
                      absolute
                      inset-0
                      rounded-[22px]
                      bg-[#B4DBDC]
                      p-1
                    "
                  >

                    <img
                      src={
                        worker.image ||
                        "https://via.placeholder.com/250"
                      }
                      alt={worker.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/250";
                      }}
                      className="
                        w-full
                        h-full
                        object-cover
                        rounded-[18px]
                        bg-white
                      "
                    />

                  </div>


                  {/* SMALL TROPHY */}

                  <div
                    className="
                      absolute
                      -top-3
                      -right-3
                      w-9
                      h-9
                      rounded-xl
                      bg-[#08566E]
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-md
                      border-2
                      border-white
                    "
                  >
                    <FaTrophy size={13} />
                  </div>

                </div>

              </div>


              {/* 
                  THREE STATS
               */}

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                  mt-7
                "
              >

                {/* RATING */}

                <div
                  className="
                    bg-white
                    rounded-xl
                    border
                    border-[#6FA8AA]/30
                    px-2
                    py-3
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      text-[#6FA8AA]
                      text-[8px]
                      font-black
                    "
                  >
                    <FaStar
                      className="text-[#08566E]"
                      size={9}
                    />

                    {text.rating}
                  </div>


                  <div
                    className="
                      mt-1
                      text-[18px]
                      font-black
                      text-[#08566E]
                    "
                  >
                    {worker.rating || "—"}
                  </div>

                </div>


                {/* TRUST */}

                <div
                  className="
                    bg-white
                    rounded-xl
                    border
                    border-[#6FA8AA]/30
                    px-2
                    py-3
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      text-[#6FA8AA]
                      text-[8px]
                      font-black
                    "
                  >
                    <FaShieldAlt
                      className="text-[#08566E]"
                      size={9}
                    />

                    {text.trust}
                  </div>


                  <div
                    className="
                      mt-1
                      text-[18px]
                      font-black
                      text-[#08566E]
                    "
                  >
                    {worker.trustScore || "—"}
                    {worker.trustScore ? "%" : ""}
                  </div>

                </div>


                {/* AREA */}

                <div
                  className="
                    bg-white
                    rounded-xl
                    border
                    border-[#6FA8AA]/30
                    px-2
                    py-3
                    text-center
                    min-w-0
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      text-[#6FA8AA]
                      text-[8px]
                      font-black
                    "
                  >
                    <FaMapMarkerAlt
                      className="text-[#08566E]"
                      size={9}
                    />

                    {text.area}
                  </div>


                  <div
                    className="
                      mt-1
                      text-[10px]
                      font-black
                      text-[#08566E]
                      truncate
                    "
                  >
                    {worker.location ||
                      "Local Area"}
                  </div>

                </div>

              </div>


              {/* 
                  STATUS
               */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  bg-[#08566E]
                  rounded-xl
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#B4DBDC]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-black
                      text-white
                    "
                  >
                    Top Performer
                  </span>

                </div>


                <span
                  className="
                    text-[8px]
                    font-black
                    text-[#B4DBDC]
                    uppercase
                  "
                >
                  {worker.status ||
                    "Available"}
                </span>

              </div>


              {/* CERTIFICATE */}

              {worker.certificate && (
                <a
                  href={worker.certificate}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    block
                    text-center
                    mt-3
                    text-[8px]
                    font-black
                    text-[#08566E]
                    underline
                  "
                >
                  ✓ {text.verified}
                </a>
              )}

            </>
          )}

        </div>
      </div>
    </section>
  );
}

export default WorkerOfMonth;