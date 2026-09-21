import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaGift,
  FaTimes,
  FaTicketAlt,
  FaChevronRight,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { safeJsonParse } from "../utils/storage";

function Rewards() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    const savedCoupons = safeJsonParse(
      localStorage.getItem("myCoupons"),
      []
    );

    if (Array.isArray(savedCoupons)) {
      setCoupons(savedCoupons);
    } else {
      setCoupons([]);
    }
  }, []);

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     DISCOUNT TEXT
  ========================================================= */

  const getDiscountText = (coupon) => {
    const type = String(
      coupon?.couponDiscountType ||
        coupon?.discountType ||
        ""
    )
      .trim()
      .toLowerCase();

    const value =
      coupon?.couponDiscountValue ??
      coupon?.discountValue ??
      "";

    if (value === "" || value === null || value === undefined) {
      return coupon?.couponTitle || "SPECIAL OFFER";
    }

    if (
      type === "percent" ||
      type === "percentage"
    ) {
      return `UPTO ${value}% OFF`;
    }

    if (
      type === "flat" ||
      type === "amount"
    ) {
      return `₹${value} OFF`;
    }

    return coupon?.couponTitle || "SPECIAL OFFER";
  };

  /* =========================================================
     BRAND
  ========================================================= */

  const getBrandName = (coupon) => {
    return (
      coupon?.brandName ||
      coupon?.partnerName ||
      coupon?.brand ||
      "E-SERVOO"
    );
  };

  const getBrandImage = (coupon) => {
    return (
      coupon?.brandLogo ||
      coupon?.logo ||
      coupon?.couponImage ||
      ""
    );
  };

  /* =========================================================
     ACTION
  ========================================================= */

  const getActionText = (coupon, index) => {
    if (coupon?.actionText) {
      return String(coupon.actionText).toUpperCase();
    }

    const actions = [
      "CLAIM NOW",
      "REDEEM NOW",
      "GET OFFER",
      "SHOP NOW",
    ];

    return actions[index % actions.length];
  };

  /* =========================================================
     COPY COUPON
  ========================================================= */

  const copyCoupon = async (coupon) => {
    const code = String(
      coupon?.couponCode || ""
    ).trim();

    if (!code || code === "NOCOUPON") return;

    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1800);
    } catch (error) {
      console.error("Coupon copy failed:", error);
    }
  };

  /* =========================================================
     SORT
  ========================================================= */

  const visibleCoupons = useMemo(() => {
    return Array.isArray(coupons) ? coupons : [];
  }, [coupons]);

  return (
    <section className="min-h-screen bg-[#FAFAFA] text-[#222] pb-32 overflow-x-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative overflow-hidden bg-[#45180F] rounded-b-[52px] min-h-[355px] md:min-h-[430px]">

        {/* Background glow */}

        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#B94E25]/30 blur-3xl"></div>

        <div className="absolute top-16 -left-28 w-80 h-80 rounded-full bg-[#7A2918]/45 blur-3xl"></div>

        <div className="absolute -bottom-20 -right-24 w-96 h-96 rounded-full bg-[#A64B24]/25 blur-3xl"></div>

        {/* Subtle pattern */}

        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-white"></div>
          <div className="absolute top-36 right-8 w-20 h-20 rounded-full border border-white"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full border border-white"></div>
        </div>

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-30 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl active:scale-90 hover:bg-white/10 transition"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>

        {/* Hero content */}

        <div className="relative z-10 flex flex-col items-center pt-14 px-5">

          {/* Envelope */}

          <div className="relative w-[145px] h-[115px] md:w-[175px] md:h-[135px] mt-2">

            {/* shadow */}

            <div className="absolute left-4 right-4 bottom-0 h-8 rounded-full bg-black/40 blur-xl"></div>

            {/* envelope */}

            <div className="absolute inset-x-0 bottom-2 h-[82%] rounded-[14px] bg-gradient-to-br from-[#F47A35] via-[#D94E20] to-[#8F2615] border border-[#FFB07B]/50 shadow-[0_22px_45px_rgba(0,0,0,0.4)] overflow-hidden">

              {/* envelope lines */}

              <div className="absolute inset-x-0 top-0 h-full">
                <div
                  className="absolute top-0 left-0 w-1/2 h-full bg-[#C53E1A]/50"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 0 100%)",
                  }}
                ></div>

                <div
                  className="absolute top-0 right-0 w-1/2 h-full bg-[#A52F15]/35"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                  }}
                ></div>
              </div>

              {/* shine */}

              <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-white/20 blur-xl"></div>

            </div>

            {/* flap */}

            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 z-10"
              style={{
                borderLeft: "72px solid transparent",
                borderRight: "72px solid transparent",
                borderTop: "54px solid #FF8A4A",
              }}
            ></div>

            {/* seal */}

            <div className="absolute left-1/2 top-[61%] -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#B87333] border-4 border-[#D99A59] shadow-xl flex items-center justify-center">
              <FaGift className="text-[#542015] text-lg" />
            </div>

          </div>

          {/* Heading */}

          <h1 className="text-center text-[34px] leading-[1.04] md:text-6xl font-black text-[#FFF5F0] uppercase tracking-tight mt-7">
            Scratch &amp; Win
            <br />
            Rewards!
          </h1>

          <p className="text-center text-[#E9C8BD] text-xs md:text-sm font-bold mt-4 max-w-[330px] leading-relaxed">
            Unlock special rewards from E-SERVOO and save on your next service.
          </p>

        </div>
      </div>

      {/* =====================================================
          REWARD CARDS
      ===================================================== */}

      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 pt-8">

        {visibleCoupons.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="max-w-md mx-auto bg-white border border-[#E7E7E7] rounded-[28px] p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08)]">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF1EA] flex items-center justify-center">
              <FaTicketAlt className="text-4xl text-[#E85D25]" />
            </div>

            <h2 className="text-2xl font-black text-[#222] mt-5">
              No Rewards Yet
            </h2>

            <p className="text-[#777] font-semibold text-sm mt-2 leading-relaxed">
              Complete a booking, confirm your payment and unlock your first reward.
            </p>

            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="mt-6 bg-[#E85D25] hover:bg-[#CC4D1D] active:scale-95 text-white px-7 py-3 rounded-full font-black shadow-lg transition"
            >
              GO TO MY BOOKINGS
            </button>

          </div>

        ) : (

          /* =================================================
             COUPON GRID
          ================================================= */

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">

            {visibleCoupons.map((coupon, index) => {

              const offerText = getDiscountText(coupon);

              const brandName = getBrandName(coupon);

              const brandImage = getBrandImage(coupon);

              const actionText = getActionText(
                coupon,
                index
              );

              const couponCode =
                coupon?.couponCode ||
                "NO CODE NEEDED";

              return (
                <button
                  type="button"
                  key={`${coupon.bookingId || "booking"}-${
                    coupon.couponCode || "coupon"
                  }-${index}`}
                  onClick={() =>
                    setSelectedCoupon(coupon)
                  }
                  className="group relative overflow-hidden bg-white rounded-[21px] md:rounded-[25px] border border-[#E3E3E3] shadow-[0_7px_22px_rgba(0,0,0,0.07)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.13)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 p-4 md:p-6 text-center"
                >

                  {/* orange top line */}

                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E85D25] via-[#F28A4A] to-[#E85D25]"></div>

                  {/* logo */}

                  <div className="flex justify-center pt-2">

                    <div className="w-[66px] h-[66px] md:w-[82px] md:h-[82px] rounded-full bg-white border border-[#E6E6E6] shadow-[0_5px_15px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden">

                      {brandImage ? (

                        <img
                          src={brandImage}
                          alt={brandName}
                          className="w-full h-full object-contain p-2"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <FaGift className="text-3xl md:text-4xl text-[#E85D25]" />

                      )}

                    </div>

                  </div>

                  {/* brand */}

                  <p className="text-[#999] text-[11px] md:text-sm font-medium mt-4 truncate">
                    {brandName}
                  </p>

                  {/* title */}

                  <h3 className="text-[14px] md:text-lg font-black text-[#222] mt-1 leading-tight min-h-[38px] flex items-center justify-center">
                    {coupon?.couponTitle ||
                      "SPECIAL REWARD"}
                  </h3>

                  {/* offer */}

                  <p className="text-[17px] md:text-2xl font-black text-[#222] mt-1 leading-tight">
                    {offerText}
                  </p>

                  {/* code */}

                  <div className="flex items-center justify-center gap-1 mt-2 min-w-0">

                    <p className="text-[#AAAAAA] text-[9px] md:text-xs font-semibold truncate max-w-[105px] md:max-w-[130px]">
                      {couponCode}
                    </p>

                    {couponCode !== "NO CODE NEEDED" && (
                      <FaCopy className="text-[#BBBBBB] text-[10px] shrink-0" />
                    )}

                  </div>

                  {/* divider */}

                  <div className="h-px bg-[#E5E5E5] mt-4"></div>

                  {/* action */}

                  <div className="flex items-center justify-center gap-1 text-[#E85D25] font-black text-[11px] md:text-sm mt-4">

                    <span>{actionText}</span>

                    <FaChevronRight className="text-[9px]" />

                  </div>

                </button>
              );
            })}

          </div>
        )}

      </div>

      {/* =====================================================
          COUPON MODAL
      ===================================================== */}

      {selectedCoupon && (

        <div className="fixed inset-0 z-[180] bg-black/65 backdrop-blur-md flex items-center justify-center px-4 py-6">

          {/* backdrop */}

          <button
            type="button"
            aria-label="Close reward"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedCoupon(null)}
          ></button>

          {/* modal */}

          <div className="relative z-10 w-full max-w-md max-h-[91vh] overflow-y-auto bg-[#FAFAFA] rounded-[30px] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">

            {/* close */}

            <button
              type="button"
              onClick={() =>
                setSelectedCoupon(null)
              }
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E5E5E5] flex items-center justify-center text-[#333] active:scale-90 transition"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {/* modal header */}

            <div className="relative overflow-hidden bg-[#45180F] rounded-t-[30px] p-7 text-white text-center">

              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-[#A64B24]/30 blur-3xl"></div>

              <div className="relative w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center overflow-hidden shadow-xl">

                {getBrandImage(selectedCoupon) ? (

                  <img
                    src={getBrandImage(selectedCoupon)}
                    alt={
                      getBrandName(selectedCoupon)
                    }
                    className="w-full h-full object-contain p-2"
                  />

                ) : (

                  <FaGift className="text-4xl text-[#E85D25]" />

                )}

              </div>

              <p className="relative text-[#E9C8BD] text-[10px] font-black uppercase tracking-[0.2em] mt-4">
                E-SERVOO Reward
              </p>

              <h2 className="relative text-2xl font-black mt-2">
                {selectedCoupon.couponTitle ||
                  "Reward Coupon"}
              </h2>

            </div>

            {/* body */}

            <div className="p-5">

              {/* coupon code */}

              <div className="bg-white border-2 border-dashed border-[#E85D25] rounded-2xl p-5 text-center">

                <p className="text-[10px] font-black text-[#999] uppercase tracking-wider">
                  Coupon Code
                </p>

                <div className="flex items-center justify-center gap-3 mt-2">

                  <p className="text-2xl md:text-3xl font-black text-[#222] tracking-widest break-all">
                    {selectedCoupon.couponCode ||
                      "NOCOUPON"}
                  </p>

                  {selectedCoupon.couponCode &&
                    selectedCoupon.couponCode !==
                      "NOCOUPON" && (

                      <button
                        type="button"
                        onClick={() =>
                          copyCoupon(
                            selectedCoupon
                          )
                        }
                        className="shrink-0 w-10 h-10 rounded-xl bg-[#FFF0E8] text-[#E85D25] flex items-center justify-center active:scale-90 transition"
                        aria-label="Copy coupon"
                      >
                        {copiedCode ===
                        selectedCoupon.couponCode ? (
                          <FaCheck />
                        ) : (
                          <FaCopy />
                        )}
                      </button>
                    )}

                </div>

                {copiedCode ===
                  selectedCoupon.couponCode && (
                  <p className="text-xs font-black text-green-600 mt-2">
                    Coupon code copied!
                  </p>
                )}

              </div>

              {/* offer */}

              <div className="bg-[#FFF3EC] rounded-2xl p-5 mt-4 text-center">

                <p className="text-[10px] font-black text-[#E85D25] uppercase tracking-wider">
                  Your Reward
                </p>

                <p className="text-2xl font-black text-[#222] mt-1">
                  {getDiscountText(
                    selectedCoupon
                  )}
                </p>

              </div>

              {/* description */}

              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 mt-4">

                <p className="text-[10px] font-black text-[#999] uppercase">
                  Description
                </p>

                <p className="text-sm font-semibold text-[#555] mt-2 leading-relaxed">
                  {selectedCoupon.couponDescription ||
                    "Use this coupon on your next E-SERVOO booking."}
                </p>

              </div>

              {/* discount details */}

              <div className="grid grid-cols-2 gap-3 mt-4">

                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">

                  <p className="text-[10px] font-black text-[#999] uppercase">
                    Discount Type
                  </p>

                  <p className="font-black text-[#222] mt-1">
                    {selectedCoupon.couponDiscountType ||
                      "Reward"}
                  </p>

                </div>

                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">

                  <p className="text-[10px] font-black text-[#999] uppercase">
                    Value
                  </p>

                  <p className="font-black text-[#222] mt-1">
                    {selectedCoupon.couponDiscountValue ||
                      "N/A"}
                  </p>

                </div>

              </div>

              {/* booking details */}

              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 mt-4">

                <p className="text-[10px] font-black text-[#999] uppercase">
                  Booking Details
                </p>

                <p className="text-sm font-bold mt-2">
                  Booking ID:{" "}
                  {selectedCoupon.bookingId ||
                    "N/A"}
                </p>

                <p className="text-sm font-bold mt-1">
                  Service:{" "}
                  {selectedCoupon.service ||
                    "N/A"}
                </p>

                <p className="text-sm font-bold mt-1">
                  Worker:{" "}
                  {selectedCoupon.worker ||
                    "N/A"}
                </p>

                <p className="text-xs font-semibold text-[#777] mt-2">
                  Saved on:{" "}
                  {formatDate(
                    selectedCoupon.createdAt
                  )}
                </p>

              </div>

              {/* external offer button */}

              {selectedCoupon.offerUrl && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      selectedCoupon.offerUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="mt-4 w-full bg-[#222] text-white py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition"
                >
                  USE OFFER
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              )}

              {/* close */}

              <button
                type="button"
                onClick={() =>
                  setSelectedCoupon(null)
                }
                className="mt-3 w-full bg-[#E85D25] hover:bg-[#CC4D1D] active:scale-[0.98] text-white py-3.5 rounded-2xl font-black shadow-lg transition"
              >
                CLOSE
              </button>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default Rewards;