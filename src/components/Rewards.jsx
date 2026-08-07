import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGift, FaTimes, FaTicketAlt } from "react-icons/fa";
import { safeJsonParse } from "../utils/storage";

function Rewards() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    const savedCoupons = safeJsonParse(localStorage.getItem("myCoupons"), []);

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

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] px-4 py-8 pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="es-secondary-cta px-4 py-2.5 rounded-2xl font-black"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#08566E]">
              My Rewards
            </h1>

            <p className="text-[#06485C] text-sm font-semibold mt-1">
              Your saved E-SERVOO coupons and reward cards.
            </p>
          </div>
        </div>

        {coupons.length === 0 ? (
          <div className="bg-[#E1E9E5]/90 border border-white/80 rounded-[32px] p-8 text-center shadow-xl">
            <FaTicketAlt className="mx-auto text-5xl text-[#08566E]" />

            <h2 className="text-2xl font-black mt-4">
              No Coupons Yet
            </h2>

            <p className="text-[#06485C] font-semibold text-sm mt-2">
              Complete a booking, confirm payment and unlock your first reward.
            </p>

            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="mt-5 bg-[#08566E] text-[#E1E9E5] px-6 py-3 rounded-2xl font-black shadow-xl"
            >
              Go to My Bookings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {coupons.map((coupon, index) => (
              <button
                type="button"
                key={`${coupon.bookingId}-${coupon.couponCode}-${index}`}
                onClick={() => setSelectedCoupon(coupon)}
                className="aspect-square relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] text-white border border-white/40 shadow-xl active:scale-[0.97] hover:shadow-2xl transition p-3 text-left"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-8 w-28 h-28 bg-[#9ECFD0]/30 rounded-full blur-2xl"></div>

                <div className="relative h-full flex flex-col">
                  {coupon.couponImage ? (
                    <img
                      src={coupon.couponImage}
                      alt={coupon.couponTitle || "Coupon"}
                      className="w-full h-[52%] object-cover rounded-2xl bg-white border border-white/40"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-[52%] rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
                      <FaGift className="text-4xl" />
                    </div>
                  )}

                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D9F4F2]">
                        E-SERVOO
                      </p>

                      <h3 className="text-sm font-black leading-tight line-clamp-2 mt-1">
                        {coupon.couponTitle || "Reward Coupon"}
                      </h3>
                    </div>

                    <p className="bg-white text-[#08566E] rounded-xl px-2 py-2 text-center text-sm font-black tracking-wide mt-2 truncate">
                      {coupon.couponCode || "NOCOUPON"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCoupon && (
        <div className="fixed inset-0 z-[180] bg-black/55 backdrop-blur-md flex items-center justify-center px-4">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedCoupon(null)}
          ></div>

          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#E1E9E5] rounded-[34px] border border-white/80 shadow-[0_30px_90px_rgba(0,0,0,0.35)] text-[#08566E]">
            <button
              type="button"
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-white border border-[#B4DBDC] flex items-center justify-center text-[#08566E] shadow-md"
            >
              <FaTimes />
            </button>

            <div className="relative overflow-hidden rounded-t-[34px] bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] p-5 text-white">
              <div className="absolute -top-16 -right-12 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -left-12 w-44 h-44 bg-[#9ECFD0]/30 rounded-full blur-3xl"></div>

              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D9F4F2]">
                  E-SERVOO Reward Coupon
                </p>

                <h2 className="text-3xl font-black mt-2">
                  {selectedCoupon.couponTitle || "Reward Coupon"}
                </h2>

                {selectedCoupon.couponImage && (
                  <img
                    src={selectedCoupon.couponImage}
                    alt={selectedCoupon.couponTitle || "Coupon"}
                    className="w-full max-h-56 object-cover rounded-3xl mt-5 border border-white/40 bg-white shadow-xl"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="bg-white rounded-3xl p-4 border border-[#B4DBDC] shadow-md text-center">
                <p className="text-xs font-black text-[#0A7F88]">
                  USE CODE
                </p>

                <p className="text-4xl font-black text-[#08566E] tracking-wider mt-2">
                  {selectedCoupon.couponCode || "NOCOUPON"}
                </p>
              </div>

              <div className="mt-4 bg-white/80 rounded-3xl p-4 border border-[#B4DBDC]">
                <p className="text-xs font-black text-[#6FA8AA]">
                  Description
                </p>

                <p className="text-sm font-bold text-[#06485C] mt-1">
                  {selectedCoupon.couponDescription ||
                    "Use this coupon on your next booking."}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white/80 rounded-3xl p-4 border border-[#B4DBDC]">
                  <p className="text-xs font-black text-[#6FA8AA]">
                    Discount Type
                  </p>

                  <p className="font-black mt-1">
                    {selectedCoupon.couponDiscountType || "Reward"}
                  </p>
                </div>

                <div className="bg-white/80 rounded-3xl p-4 border border-[#B4DBDC]">
                  <p className="text-xs font-black text-[#6FA8AA]">
                    Value
                  </p>

                  <p className="font-black mt-1">
                    {selectedCoupon.couponDiscountValue || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-white/80 rounded-3xl p-4 border border-[#B4DBDC]">
                <p className="text-xs font-black text-[#6FA8AA]">
                  Booking Details
                </p>

                <p className="text-sm font-bold mt-2">
                  Booking ID: {selectedCoupon.bookingId || "N/A"}
                </p>

                <p className="text-sm font-bold mt-1">
                  Service: {selectedCoupon.service || "N/A"}
                </p>

                <p className="text-sm font-bold mt-1">
                  Worker: {selectedCoupon.worker || "N/A"}
                </p>

                <p className="text-xs font-semibold text-[#06485C] mt-2">
                  Saved on: {formatDate(selectedCoupon.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCoupon(null)}
                className="mt-5 w-full bg-[#08566E] text-[#E1E9E5] px-5 py-3 rounded-2xl font-black shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Rewards;