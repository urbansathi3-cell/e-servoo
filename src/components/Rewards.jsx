import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaGift,
  FaTimes,
  FaTicketAlt,
  FaChevronRight,
} from "react-icons/fa";
import { safeJsonParse } from "../utils/storage";

function Rewards() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

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

  const getDiscountText = (coupon) => {
    const type = String(
      coupon?.couponDiscountType || ""
    ).trim().toLowerCase();

    const value = coupon?.couponDiscountValue;

    if (!value) {
      return coupon?.couponTitle || "SPECIAL OFFER";
    }

    if (type === "percent" || type === "percentage") {
      return `UPTO ${value}% OFF`;
    }

    if (type === "flat" || type === "amount") {
      return `₹${value} OFF`;
    }

    return coupon?.couponTitle || "SPECIAL OFFER";
  };

  const getActionText = (index) => {
    const actions = [
      "CLAIM NOW",
      "REDEEM NOW",
      "GET OFFER",
      "SHOP NOW",
    ];

    return actions[index % actions.length];
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] text-[#222] pb-28">

      {/* =====================================================
          TOP HERO
      ===================================================== */}

      <div className="relative overflow-hidden bg-[#45180F] rounded-b-[58px] min-h-[360px] md:min-h-[420px]">

        {/* Background glow */}

        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#A64B24]/30 rounded-full blur-3xl"></div>

        <div className="absolute top-20 -left-20 w-72 h-72 bg-[#7A2918]/40 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-[#A64B24]/25 rounded-full blur-3xl"></div>

        {/* Back button */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-5 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/10 transition"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>

        {/* Decorative envelope */}

        <div className="relative z-10 flex flex-col items-center justify-center pt-16 px-5">

          <div className="relative w-32 h-24 md:w-40 md:h-28 mt-3">

            {/* Envelope shadow */}

            <div className="absolute inset-x-2 bottom-0 h-12 bg-black/30 blur-xl rounded-full"></div>

            {/* Envelope body */}

            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#F47A35] via-[#D94E20] to-[#8F2615] shadow-[0_20px_45px_rgba(0,0,0,0.35)] border border-[#FFB07B]/40"></div>

            {/* Envelope flap */}

            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "64px solid transparent",
                borderRight: "64px solid transparent",
                borderTop: "48px solid #FF8A4A",
              }}
            ></div>

            {/* Seal */}

            <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#B87333] border-4 border-[#D99A59] shadow-lg flex items-center justify-center">

              <FaGift className="text-[#542015] text-lg" />

            </div>

          </div>

          <h1 className="text-center text-[36px] md:text-6xl leading-[1.05] font-black text-[#FFF5F0] uppercase tracking-tight mt-8">
            Scratch &amp; Win
            <br />
            Rewards!
          </h1>

          <p className="text-center text-[#E9C8BD] text-xs md:text-sm font-bold mt-4 max-w-md">
            Unlock special rewards from E-SERVOO and save on your next service.
          </p>

        </div>
      </div>

      {/* =====================================================
          COUPON SECTION
      ===================================================== */}

      <div className="max-w-6xl mx-auto px-5 md:px-8 -mt-1 pt-8">

        {coupons.length === 0 ? (

          <div className="max-w-md mx-auto bg-white border border-[#E5E5E5] rounded-[28px] p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08)]">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF1EA] flex items-center justify-center">
              <FaTicketAlt className="text-4xl text-[#E85D25]" />
            </div>

            <h2 className="text-2xl font-black text-[#222] mt-5">
              No Rewards Yet
            </h2>

            <p className="text-[#777] font-semibold text-sm mt-2 leading-relaxed">
              Complete a booking, confirm payment and unlock your first reward.
            </p>

            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="mt-6 bg-[#E85D25] hover:bg-[#CC4D1D] text-white px-7 py-3 rounded-full font-black shadow-lg transition"
            >
              GO TO MY BOOKINGS
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">

            {coupons.map((coupon, index) => {

              const offerText = getDiscountText(coupon);

              return (
                <button
                  type="button"
                  key={`${coupon.bookingId || "booking"}-${
                    coupon.couponCode || "coupon"
                  }-${index}`}
                  onClick={() => setSelectedCoupon(coupon)}
                  className="group relative overflow-hidden bg-white rounded-[22px] md:rounded-[26px] border border-[#E5E5E5] shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.14)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 p-4 md:p-6 text-center"
                >

                  {/* Small top decoration */}

                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E85D25] via-[#F48B4A] to-[#E85D25]"></div>

                  {/* Coupon logo */}

                  <div className="flex justify-center pt-2">

                    <div className="w-[68px] h-[68px] md:w-[82px] md:h-[82px] rounded-full bg-white border border-[#E5E5E5] shadow-[0_5px_15px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden">

                      {coupon.couponImage ? (

                        <img
                          src={coupon.couponImage}
                          alt={
                            coupon.couponTitle ||
                            "E-SERVOO Reward"
                          }
                          className="w-full h-full object-contain p-2"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";

                            const parent =
                              event.currentTarget.parentElement;

                            if (parent) {
                              parent.innerHTML =
                                '<span style="font-size:28px">🎁</span>';
                            }
                          }}
                        />

                      ) : (

                        <FaGift className="text-3xl md:text-4xl text-[#E85D25]" />

                      )}

                    </div>

                  </div>

                  {/* Brand */}

                  <p className="text-[#999] text-xs md:text-sm font-medium mt-4">
                    E-SERVOO
                  </p>

                  {/* Coupon title */}

                  <h3 className="text-[15px] md:text-lg font-black text-[#222] mt-1 leading-tight min-h-[38px] flex items-center justify-center">
                    {coupon.couponTitle ||
                      "SPECIAL REWARD"}
                  </h3>

                  {/* Main offer */}

                  <p className="text-[17px] md:text-2xl font-black text-[#222] mt-1 leading-tight">
                    {offerText}
                  </p>

                  {/* Coupon code */}

                  <div className="flex items-center justify-center gap-1 mt-2">

                    <p className="text-[#AAAAAA] text-[10px] md:text-xs font-semibold truncate max-w-[130px]">
                      {coupon.couponCode ||
                        "NO CODE NEEDED"}
                    </p>

                    <span className="text-[#BBBBBB] text-xs">
                      ◇
                    </span>

                  </div>

                  {/* Divider */}

                  <div className="h-px bg-[#E5E5E5] mt-4"></div>

                  {/* Action */}

                  <div className="flex items-center justify-center gap-1 text-[#E85D25] font-black text-xs md:text-sm mt-4">

                    <span>
                      {getActionText(index)}
                    </span>

                    <FaChevronRight className="text-[10px]" />

                  </div>

                </button>
              );
            })}

          </div>
        )}

      </div>

      {/* =====================================================
          COUPON DETAILS MODAL
      ===================================================== */}

      {selectedCoupon && (

        <div className="fixed inset-0 z-[180] bg-black/60 backdrop-blur-md flex items-center justify-center px-4 py-6">

          <div
            className="absolute inset-0"
            onClick={() => setSelectedCoupon(null)}
          ></div>

          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FAFAFA] rounded-[30px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">

            {/* Close */}

            <button
              type="button"
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E5E5E5] flex items-center justify-center text-[#333]"
            >
              <FaTimes />
            </button>

            {/* Modal header */}

            <div className="bg-[#45180F] rounded-t-[30px] p-6 text-white text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center overflow-hidden shadow-xl">

                {selectedCoupon.couponImage ? (

                  <img
                    src={selectedCoupon.couponImage}
                    alt={
                      selectedCoupon.couponTitle ||
                      "Reward"
                    }
                    className="w-full h-full object-contain p-2"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <FaGift className="text-4xl text-[#E85D25]" />

                )}

              </div>

              <p className="text-[#E9C8BD] text-xs font-black uppercase tracking-widest mt-4">
                E-SERVOO Reward
              </p>

              <h2 className="text-2xl font-black mt-2">
                {selectedCoupon.couponTitle ||
                  "Reward Coupon"}
              </h2>

            </div>

            {/* Modal body */}

            <div className="p-5">

              {/* Code */}

              <div className="bg-white border-2 border-dashed border-[#E85D25] rounded-2xl p-5 text-center">

                <p className="text-xs font-black text-[#999] uppercase">
                  Coupon Code
                </p>

                <p className="text-3xl font-black text-[#222] tracking-widest mt-2 break-all">
                  {selectedCoupon.couponCode ||
                    "NOCOUPON"}
                </p>

              </div>

              {/* Offer */}

              <div className="bg-[#FFF3EC] rounded-2xl p-4 mt-4 text-center">

                <p className="text-xs font-black text-[#E85D25] uppercase">
                  Your Reward
                </p>

                <p className="text-2xl font-black text-[#222] mt-1">
                  {getDiscountText(selectedCoupon)}
                </p>

              </div>

              {/* Description */}

              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 mt-4">

                <p className="text-xs font-black text-[#999]">
                  DESCRIPTION
                </p>

                <p className="text-sm font-semibold text-[#555] mt-2 leading-relaxed">
                  {selectedCoupon.couponDescription ||
                    "Use this coupon on your next E-SERVOO booking."}
                </p>

              </div>

              {/* Details */}

              <div className="grid grid-cols-2 gap-3 mt-4">

                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">

                  <p className="text-[10px] font-black text-[#999]">
                    DISCOUNT TYPE
                  </p>

                  <p className="font-black text-[#222] mt-1">
                    {selectedCoupon.couponDiscountType ||
                      "Reward"}
                  </p>

                </div>

                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">

                  <p className="text-[10px] font-black text-[#999]">
                    VALUE
                  </p>

                  <p className="font-black text-[#222] mt-1">
                    {selectedCoupon.couponDiscountValue ||
                      "N/A"}
                  </p>

                </div>

              </div>

              {/* Booking */}

              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 mt-4">

                <p className="text-[10px] font-black text-[#999]">
                  BOOKING DETAILS
                </p>

                <p className="text-sm font-bold mt-2">
                  Booking ID:{" "}
                  {selectedCoupon.bookingId || "N/A"}
                </p>

                <p className="text-sm font-bold mt-1">
                  Service:{" "}
                  {selectedCoupon.service || "N/A"}
                </p>

                <p className="text-sm font-bold mt-1">
                  Worker:{" "}
                  {selectedCoupon.worker || "N/A"}
                </p>

                <p className="text-xs font-semibold text-[#777] mt-2">
                  Saved on:{" "}
                  {formatDate(selectedCoupon.createdAt)}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedCoupon(null)}
                className="mt-5 w-full bg-[#E85D25] hover:bg-[#CC4D1D] text-white py-3.5 rounded-2xl font-black shadow-lg transition"
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