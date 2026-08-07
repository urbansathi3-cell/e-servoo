import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClipboardList,
  FaStar,
  FaTimes,
  FaMapMarkerAlt,
  FaUserTie,
  FaTools,
  FaLock,
  FaCheckCircle,
  FaGift,
  FaRupeeSign,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";
import {
  getStoredUser,
  getStoredToken,
  safeJsonParse,
  saveJsonToStorage,
} from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function MyBookings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(null);

  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});

  const [paymentInputs, setPaymentInputs] = useState({});
  const [paymentLoading, setPaymentLoading] = useState({});
  const [revealedCoupons, setRevealedCoupons] = useState({});
  const [couponPopup, setCouponPopup] = useState(null);

  const [reviewedBookings, setReviewedBookings] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem("reviewedBookings"), {});

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      localStorage.removeItem("reviewedBookings");
      return {};
    }

    return saved;
  });

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

  const formatCurrency = (amount) => {
    const value = Number(String(amount || 0).replace(/[₹,\s]/g, ""));
    const safeValue = Number.isFinite(value) ? value : 0;

    return `₹${safeValue.toLocaleString("en-IN")}`;
  };

  const getBookingKey = (booking, index) => {
    return String(
      getValue(
        booking,
        [
          "BookingID",
          "BookingId",
          "Booking id",
          "bookingId",
          "bookingid",
        ],
        `booking-${index}`
      )
    );
  };

  const isBookingCompleted = (status) => {
    const cleanStatus = String(status || "").trim().toLowerCase();

    return (
      cleanStatus === "completed" ||
      cleanStatus === "complete" ||
      cleanStatus === "done"
    );
  };

  const isPaymentConfirmed = (value) => {
    const cleanValue = String(value || "").trim().toLowerCase();

    return (
      cleanValue === "yes" ||
      cleanValue === "true" ||
      cleanValue === "confirmed"
    );
  };

  const getBookingDetails = (booking, index) => {
    const bookingKey = getBookingKey(booking, index);

    return {
      bookingKey,
      bookingId: getValue(
        booking,
        [
          "BookingID",
          "BookingId",
          "Booking id",
          "bookingId",
          "bookingid",
        ],
        bookingKey
      ),
      service: getValue(
        booking,
        ["Service", "service", "services", "category"],
        "Service Not Found"
      ),
      worker: getValue(
        booking,
        [
          "Worker",
          "worker",
          "Worker Name",
          "workerName",
          "workername",
        ],
        "Worker Not Found"
      ),
      workerId: getValue(
        booking,
        [
          "WorkerID",
          "WorkerId",
          "workerId",
          "workerid",
          "id",
        ],
        ""
      ),
      address: getValue(
        booking,
        ["Address", "address"],
        "Address Not Found"
      ),
      issue: getValue(
        booking,
        [
          "Issue Description",
          "issueDescription",
          "issuedescription",
          "Issue",
          "issue",
        ],
        ""
      ),
      urgency: getValue(booking, ["Urgency", "urgency"], "Normal"),
      status: getValue(booking, ["Status", "status"], "Pending"),
      date: getValue(booking, ["Date", "date"], ""),

      paymentAmount: getValue(
        booking,
        ["PaymentAmount", "paymentamount", "amount"],
        ""
      ),
      paymentMode: getValue(
        booking,
        ["PaymentMode", "paymentmode"],
        ""
      ),
      customerPaidAmount: getValue(
        booking,
        ["CustomerPaidAmount", "customerpaidamount"],
        ""
      ),
      customerPaymentMode: getValue(
        booking,
        ["CustomerPaymentMode", "customerpaymentmode"],
        ""
      ),
      paymentConfirmedByCustomer: getValue(
        booking,
        [
          "PaymentConfirmedByCustomer",
          "paymentconfirmedbycustomer",
        ],
        ""
      ),
      paymentVerificationStatus: getValue(
        booking,
        [
          "PaymentVerificationStatus",
          "paymentverificationstatus",
        ],
        ""
      ),
      commissionAmount: getValue(
        booking,
        ["CommissionAmount", "commissionamount"],
        ""
      ),
      couponCode: getValue(
        booking,
        ["CouponCode", "couponcode"],
        ""
      ),
      couponTitle: getValue(
        booking,
        ["CouponTitle", "coupontitle"],
        ""
      ),
      couponDescription: getValue(
        booking,
        ["CouponDescription", "coupondescription"],
        ""
      ),
      couponImage: getValue(
  booking,
  ["CouponImage", "couponimage"],
  ""
),
couponDiscountType: getValue(
  booking,
  ["CouponDiscountType", "coupondiscounttype"],
  ""
),
couponDiscountValue: getValue(
  booking,
  ["CouponDiscountValue", "coupondiscountvalue"],
  ""
),
    };
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date Not Found";

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

  const getStatusClass = (status) => {
    const cleanStatus = String(status).toLowerCase();

    if (isBookingCompleted(cleanStatus)) {
      return "bg-green-600 text-white";
    }

    if (cleanStatus === "cancelled") {
      return "bg-red-500 text-white";
    }

    if (cleanStatus === "accepted") {
      return "bg-blue-600 text-white";
    }

    return "bg-[#08566E] text-[#E1E9E5]";
  };

  const fetchMyBookings = async (savedUser) => {
    if (!savedUser || !savedUser.phone) {
      setUser(null);
      setBookings([]);
      setLoading(false);
      return;
    }

    setUser(savedUser);

    try {
      const res = await fetch(
        `${API_URL}?phone=${encodeURIComponent(
          savedUser.phone
        )}&nocache=${Date.now()}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.log("My Bookings Error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = getStoredUser();
    fetchMyBookings(savedUser);
  }, []);

  const openBookingDetails = (booking, index) => {
    const details = getBookingDetails(booking, index);

    setSelectedBooking(booking);
    setSelectedBookingIndex(index);

    setPaymentInputs((prev) => ({
      ...prev,
      [details.bookingKey]: {
        amount:
          prev[details.bookingKey]?.amount ||
          details.customerPaidAmount ||
          details.paymentAmount ||
          "",
        paymentMode:
          prev[details.bookingKey]?.paymentMode ||
          details.customerPaymentMode ||
          "Cash",
      },
    }));
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
    setSelectedBookingIndex(null);
  };

  const updateReviewInput = (bookingKey, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [bookingKey]: {
        rating: 0,
        review: "",
        ...prev[bookingKey],
        [field]: value,
      },
    }));
  };

  const updatePaymentInput = (bookingKey, field, value) => {
    setPaymentInputs((prev) => ({
      ...prev,
      [bookingKey]: {
        amount: "",
        paymentMode: "Cash",
        ...prev[bookingKey],
        [field]: value,
      },
    }));
  };

  const refreshSelectedBooking = (bookingId, freshBookings) => {
    const foundIndex = freshBookings.findIndex((booking, index) => {
      const details = getBookingDetails(booking, index);
      return details.bookingId === bookingId;
    });

    if (foundIndex !== -1) {
      setSelectedBooking(freshBookings[foundIndex]);
      setSelectedBookingIndex(foundIndex);
    }
  };

  const confirmCustomerPayment = async (booking, index) => {
    const details = getBookingDetails(booking, index);
    const bookingKey = details.bookingKey;

    if (!isBookingCompleted(details.status)) {
      alert("Payment confirmation is available only after job completion.");
      return;
    }

    if (isPaymentConfirmed(details.paymentConfirmedByCustomer)) {
      alert("Payment already confirmed for this booking.");
      return;
    }

    const currentPayment = paymentInputs[bookingKey] || {
      amount: "",
      paymentMode: "Cash",
    };

    const amount = Number(
      String(currentPayment.amount || "").replace(/[₹,\s]/g, "")
    );

    if (!amount || amount <= 0) {
      alert("Please enter valid amount paid to worker.");
      return;
    }

    setPaymentLoading((prev) => ({
      ...prev,
      [bookingKey]: true,
    }));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "confirmCustomerPayment",
          token: getStoredToken(),
          bookingId: details.bookingId,
          phone: user?.phone || "",
          customerPaidAmount: amount,
          customerPaymentMode: currentPayment.paymentMode || "Cash",
          commissionPercent: 10,
        }),
      });

      const data = await res.json();

      console.log("Customer payment confirmation response:", data);

      if (!data.success) {
        alert(data.message || "Payment confirmation failed.");
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "customer_payment_confirmed",
        page_section: "my_bookings",
        amount: amount,
        payment_mode: currentPayment.paymentMode || "Cash",
        verification_status: data.paymentVerificationStatus,
      });

      const savedUser = getStoredUser();

      const freshRes = await fetch(
        `${API_URL}?phone=${encodeURIComponent(
          savedUser.phone
        )}&nocache=${Date.now()}`
      );

      const freshData = await freshRes.json();
      const freshBookings = Array.isArray(freshData)
        ? freshData
        : Array.isArray(freshData.bookings)
          ? freshData.bookings
          : [];

      setBookings(freshBookings);
      refreshSelectedBooking(details.bookingId, freshBookings);

      setRevealedCoupons((prev) => ({
        ...prev,
        [bookingKey]: false,
      }));

      const rewardCoupon = {
  bookingId: details.bookingId,
  service: details.service,
  worker: details.worker,
  couponCode: data?.coupon?.code || "",
  couponTitle: data?.coupon?.title || "",
  couponDescription: data?.coupon?.description || "",
  couponImage: data?.coupon?.image || "",
  couponDiscountType: data?.coupon?.discountType || "",
  couponDiscountValue: data?.coupon?.discountValue || "",
  createdAt: new Date().toISOString(),
};

const oldCoupons = safeJsonParse(localStorage.getItem("myCoupons"), []);

const safeOldCoupons = Array.isArray(oldCoupons) ? oldCoupons : [];

const filteredCoupons = safeOldCoupons.filter(
  (coupon) => coupon.bookingId !== details.bookingId
);

const updatedCoupons = [rewardCoupon, ...filteredCoupons];

saveJsonToStorage("myCoupons", updatedCoupons);

setCouponPopup(rewardCoupon);

alert("Payment confirmed. Your scratch coupon is ready!");
    } catch (error) {
      console.log("Payment Confirmation Error:", error);
      alert("Payment confirmation failed. Please try again.");
    } finally {
      setPaymentLoading((prev) => ({
        ...prev,
        [bookingKey]: false,
      }));
    }
  };

  const submitReview = async (booking, index) => {
    const details = getBookingDetails(booking, index);

    if (!isBookingCompleted(details.status)) {
      alert("Review can be submitted only after service is completed.");
      return;
    }

    const bookingKey = details.bookingKey;

    const currentReview = reviewInputs[bookingKey] || {
      rating: 0,
      review: "",
    };

    const rating = Number(currentReview.rating);
    const reviewText = String(currentReview.review || "").trim();

    if (!rating || rating < 1) {
      alert("Please select a star rating.");
      return;
    }

    if (!reviewText) {
      alert("Please write a short review.");
      return;
    }

    const workerId = details.workerId || details.worker;

    if (!workerId || workerId === "Worker Not Found") {
      alert("Worker information not found for this booking.");
      return;
    }

    setReviewLoading((prev) => ({
      ...prev,
      [bookingKey]: true,
    }));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "review",
          token: getStoredToken(),
          workerId: workerId,
          bookingId: details.bookingId,
          rating: rating,
          review: reviewText,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Review submit failed.");
        return;
      }

      const updatedReviewedBookings = {
        ...reviewedBookings,
        [bookingKey]: true,
      };

      setReviewedBookings(updatedReviewedBookings);
      saveJsonToStorage("reviewedBookings", updatedReviewedBookings);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "review_submitted",
        page_section: "my_bookings",
        rating: rating,
      });

      alert("Thank you! Your review has been submitted.");
    } catch (error) {
      console.log("Review Error:", error);
      alert("Review submit failed. Please try again.");
    } finally {
      setReviewLoading((prev) => ({
        ...prev,
        [bookingKey]: false,
      }));
    }
  };

  if (!user && !loading) {
    return (
      <section className="min-h-screen bg-[#B4DBDC] flex items-center justify-center px-5 text-[#08566E]">
        <div className="bg-[#E1E9E5] rounded-3xl p-7 shadow-xl border border-[#6FA8AA] max-w-md text-center">
          <h2 className="text-2xl font-black">Please Login First</h2>

          <p className="mt-2 font-semibold text-[#06485C] text-sm">
            Login required to view your bookings.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="es-primary-cta mt-5 px-5 py-2.5 rounded-2xl font-black"
          >
            Go to Home
          </button>
        </div>
      </section>
    );
  }

  const modalDetails =
    selectedBooking && selectedBookingIndex !== null
      ? getBookingDetails(selectedBooking, selectedBookingIndex)
      : null;

  const modalReview =
    modalDetails && reviewInputs[modalDetails.bookingKey]
      ? reviewInputs[modalDetails.bookingKey]
      : {
          rating: 0,
          review: "",
        };

  const modalPayment =
    modalDetails && paymentInputs[modalDetails.bookingKey]
      ? paymentInputs[modalDetails.bookingKey]
      : {
          amount: "",
          paymentMode: "Cash",
        };

  const modalReviewed =
    modalDetails && reviewedBookings[modalDetails.bookingKey];

  const modalCompleted =
    modalDetails && isBookingCompleted(modalDetails.status);

  const modalPaymentConfirmed =
    modalDetails &&
    isPaymentConfirmed(modalDetails.paymentConfirmedByCustomer);

  const modalCouponRevealed =
    modalDetails && revealedCoupons[modalDetails.bookingKey];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] px-4 py-8 pb-28 text-[#08566E]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="es-secondary-cta px-3 py-2.5 rounded-2xl font-black"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h2 className="text-3xl font-black text-[#08566E]">
              My Bookings
            </h2>

            <p className="text-[#06485C] font-semibold mt-1 text-sm">
              Tap a booking card to view details, confirm payment and unlock rewards.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-36 rounded-[24px] bg-white/50 animate-pulse border border-white/80"
              ></div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#E1E9E5]/90 rounded-3xl p-8 text-center border border-white/80 shadow-xl">
            <FaClipboardList className="mx-auto text-4xl text-[#08566E]" />

            <h3 className="text-xl font-black mt-4">No Bookings Found</h3>

            <p className="text-[#06485C] font-semibold mt-2 text-sm">
              Book a service to see your booking history here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="es-primary-cta mt-5 px-5 py-2.5 rounded-2xl font-black"
            >
              Book a Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {bookings.map((booking, index) => {
              const details = getBookingDetails(booking, index);
              const completed = isBookingCompleted(details.status);
              const isReviewed = reviewedBookings[details.bookingKey];
              const paymentConfirmed = isPaymentConfirmed(
                details.paymentConfirmedByCustomer
              );

              return (
                <button
                  type="button"
                  key={details.bookingKey}
                  onClick={() => openBookingDetails(booking, index)}
                  className="text-left bg-[#E1E9E5]/90 border border-white/80 rounded-[24px] p-3 shadow-lg hover:shadow-xl active:scale-[0.97] transition min-h-[165px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shadow-md shrink-0">
                      <FaTools />
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${getStatusClass(
                        details.status
                      )}`}
                    >
                      {details.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-black text-[#08566E] leading-tight line-clamp-2">
                    {details.service}
                  </h3>

                  <p className="mt-1 text-[11px] font-black text-[#06485C]">
                    ID: {details.bookingId}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-[#08566E]/85 line-clamp-1">
                    {details.worker}
                  </p>

                  <div className="mt-3 grid gap-1">
                    {paymentConfirmed ? (
                      <span className="text-[10px] font-black text-green-700">
                        Payment Verified 🎁
                      </span>
                    ) : completed ? (
                      <span className="text-[10px] font-black text-orange-700">
                        Confirm Payment
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-[#08566E]/70">
                        Payment Locked
                      </span>
                    )}

                    {isReviewed ? (
                      <span className="text-[10px] font-black text-green-700">
                        Reviewed
                      </span>
                    ) : completed ? (
                      <span className="text-[10px] font-black text-green-700">
                        Review Now
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-[#08566E]/70">
                        Review Locked
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {modalDetails && (
        <div className="fixed inset-0 z-[120] bg-black/35 backdrop-blur-sm flex items-end md:items-center justify-center px-3">
          <div
            className="absolute inset-0"
            onClick={closeBookingDetails}
          ></div>

          <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#E1E9E5] border border-white/80 rounded-t-[32px] md:rounded-[32px] shadow-[0_25px_80px_rgba(8,86,110,0.45)] p-5 md:p-6 text-[#08566E]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6FA8AA]">
                  Booking Details
                </p>

                <h3 className="text-2xl md:text-3xl font-black mt-1 leading-tight">
                  {modalDetails.service}
                </h3>

                <p className="text-sm font-black text-[#06485C] mt-1">
                  Booking ID: {modalDetails.bookingId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBookingDetails}
                className="w-10 h-10 rounded-2xl bg-white/80 border border-[#B4DBDC] text-[#08566E] flex items-center justify-center shadow-md"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-black ${getStatusClass(
                  modalDetails.status
                )}`}
              >
                {modalDetails.status}
              </span>

              <span className="px-3 py-1.5 rounded-full text-xs font-black bg-[#B4DBDC] text-[#08566E]">
                {modalDetails.urgency}
              </span>

              {modalPaymentConfirmed && (
                <span className="px-3 py-1.5 rounded-full text-xs font-black bg-green-600 text-white">
                  ✅ Payment Confirmed
                </span>
              )}

              {modalReviewed && (
                <span className="px-3 py-1.5 rounded-full text-xs font-black bg-green-600 text-white">
                  ✅ Reviewed
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3">
              <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                    <FaUserTie />
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#6FA8AA]">
                      Worker
                    </p>

                    <p className="font-black text-[#08566E]">
                      {modalDetails.worker}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#6FA8AA]">
                      Address
                    </p>

                    <p className="font-semibold text-sm text-[#08566E]">
                      {modalDetails.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                  <p className="text-xs font-black text-[#6FA8AA]">Date</p>

                  <p className="font-bold text-sm mt-1">
                    {formatDate(modalDetails.date)}
                  </p>
                </div>

                <div className="bg-white/75 rounded-3xl p-4 border border-[#B4DBDC]">
                  <p className="text-xs font-black text-[#6FA8AA]">Issue</p>

                  <p className="font-bold text-sm mt-1">
                    {modalDetails.issue || "No issue details added"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-white/85 border border-[#B4DBDC] rounded-3xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-black text-[#08566E] flex items-center gap-2">
                    <FaRupeeSign />
                    Confirm Payment
                  </h4>

                  <p className="text-[#06485C] text-xs font-semibold mt-1">
                    Enter the actual amount paid to worker. This helps E-SERVOO verify income and commission.
                  </p>
                </div>

                {modalPaymentConfirmed && (
                  <span className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-black shrink-0">
                    Verified
                  </span>
                )}
              </div>

              {!modalCompleted ? (
                <div className="mt-4 bg-[#F8FCFA] border border-[#B4DBDC] rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                      <FaLock />
                    </div>

                    <div>
                      <p className="font-black text-[#08566E]">
                        Payment Confirmation Locked
                      </p>

                      <p className="text-sm font-semibold text-[#06485C] mt-1">
                        Payment confirmation will unlock only after service is completed by the worker.
                      </p>
                    </div>
                  </div>
                </div>
              ) : modalPaymentConfirmed ? (
                <div className="mt-4 grid gap-3">
                  <div className="bg-green-50 border border-green-300 rounded-2xl p-4">
                    <p className="text-green-700 font-black text-sm flex items-center gap-2">
                      <FaShieldAlt />
                      Payment confirmed by customer.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white rounded-2xl p-3 border border-green-200">
                        <p className="text-xs font-black text-green-700">
                          Paid Amount
                        </p>

                        <p className="text-xl font-black text-[#08566E]">
                          {formatCurrency(modalDetails.customerPaidAmount)}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-3 border border-green-200">
                        <p className="text-xs font-black text-green-700">
                          Mode
                        </p>

                        <p className="text-xl font-black text-[#08566E]">
                          {modalDetails.customerPaymentMode || "Cash"}
                        </p>
                      </div>
                    </div>

                    {modalDetails.paymentVerificationStatus && (
                      <p
                        className={`mt-3 text-xs font-black ${
                          String(
                            modalDetails.paymentVerificationStatus
                          ).toLowerCase() === "mismatch"
                            ? "text-orange-700"
                            : "text-green-700"
                        }`}
                      >
                        Verification: {modalDetails.paymentVerificationStatus}
                      </p>
                    )}
                  </div>

                  {modalDetails.couponCode && (
                    <div className="rounded-3xl p-4 bg-gradient-to-br from-[#043A4A] via-[#08566E] to-[#0A7F88] text-white shadow-xl overflow-hidden relative">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-[#9ECFD0]/30 rounded-full blur-2xl"></div>

                      <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D9F4F2]">
                          E-SERVOO Reward
                        </p>

                        <h4 className="text-2xl font-black mt-1 flex items-center gap-2">
                          <FaGift />
                          Scratch Coupon
                        </h4>

                        <button
                          type="button"
                          onClick={() =>
                            setRevealedCoupons((prev) => ({
                              ...prev,
                              [modalDetails.bookingKey]: true,
                            }))
                          }
                          className={`mt-4 w-full min-h-[130px] rounded-3xl border border-white/40 flex flex-col items-center justify-center text-center transition overflow-hidden ${
                            modalCouponRevealed
                              ? "bg-white text-[#08566E]"
                              : "bg-[#E1E9E5]/20 text-white hover:scale-[1.01]"
                          }`}
                        >
                          {modalCouponRevealed ? (
  <>
    {modalDetails.couponImage && (
      <img
        src={modalDetails.couponImage}
        alt={modalDetails.couponTitle || "E-SERVOO Coupon"}
        className="w-full max-h-44 object-cover rounded-2xl mb-3 border border-[#B4DBDC] shadow-md"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    )}

    <p className="text-sm font-black text-[#0A7F88]">
      {modalDetails.couponTitle || "Reward"}
    </p>

    <p className="text-4xl font-black mt-2 tracking-wider">
      {modalDetails.couponCode}
    </p>

    <p className="text-xs font-bold mt-2 text-[#06485C] px-4">
      {modalDetails.couponDescription ||
        "Use this coupon on your next booking."}
    </p>

    {(modalDetails.couponDiscountType || modalDetails.couponDiscountValue) && (
      <p className="mt-2 text-xs font-black text-green-700">
        {modalDetails.couponDiscountType}{" "}
        {modalDetails.couponDiscountValue}
      </p>
    )}
  </>
) : (
                            <>
                              <div className="w-16 h-16 rounded-3xl bg-white text-[#08566E] flex items-center justify-center text-3xl font-black shadow-xl">
                                ES
                              </div>

                              <p className="text-lg font-black mt-3">
                                Tap to Scratch
                              </p>

                              <p className="text-xs font-bold text-[#D9F4F2] mt-1">
                                Your coupon is hidden behind E-SERVOO cover
                              </p>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 grid gap-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-[#08566E]">
                        Amount paid to worker
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={modalPayment.amount}
                        onChange={(event) =>
                          updatePaymentInput(
                            modalDetails.bookingKey,
                            "amount",
                            event.target.value
                          )
                        }
                        placeholder="Example: 500"
                        className="w-full mt-2 p-4 rounded-2xl border border-[#6FA8AA] bg-[#E1E9E5] text-[#08566E] text-sm font-black outline-none focus:border-[#08566E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-[#08566E]">
                        Payment mode
                      </label>

                      <select
                        value={modalPayment.paymentMode}
                        onChange={(event) =>
                          updatePaymentInput(
                            modalDetails.bookingKey,
                            "paymentMode",
                            event.target.value
                          )
                        }
                        className="w-full mt-2 p-4 rounded-2xl border border-[#6FA8AA] bg-[#E1E9E5] text-[#08566E] text-sm font-black outline-none focus:border-[#08566E]"
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#F8FCFA] border border-[#B4DBDC] rounded-2xl p-4">
                    <p className="text-xs font-black text-[#08566E] flex items-center gap-2">
                      <FaCreditCard />
                      Worker entered amount:{" "}
                      {modalDetails.paymentAmount
                        ? formatCurrency(modalDetails.paymentAmount)
                        : "Not entered"}
                    </p>

                    <p className="text-xs font-semibold text-[#06485C] mt-2">
                      Agar worker amount aur customer amount same hoga, payment verified hoga. Agar different hoga to mismatch mark hoga.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={paymentLoading[modalDetails.bookingKey]}
                    onClick={() =>
                      confirmCustomerPayment(
                        selectedBooking,
                        selectedBookingIndex
                      )
                    }
                    className="es-primary-cta w-full px-5 py-3 rounded-2xl font-black text-sm disabled:opacity-60"
                  >
                    {paymentLoading[modalDetails.bookingKey]
                      ? "Confirming..."
                      : "Confirm Payment & Get Coupon"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 bg-white/85 border border-[#B4DBDC] rounded-3xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-black text-[#08566E]">
                    Rate & Review
                  </h4>

                  <p className="text-[#06485C] text-xs font-semibold mt-1">
                    Rating option appears only after service completion.
                  </p>
                </div>

                {modalReviewed && (
                  <span className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-black shrink-0">
                    ✅ Reviewed
                  </span>
                )}
              </div>

              {modalReviewed ? (
                <div className="mt-4 bg-green-50 border border-green-300 rounded-2xl p-4">
                  <p className="text-green-700 font-black text-sm flex items-center gap-2">
                    <FaCheckCircle />
                    Thank you for reviewing this booking.
                  </p>
                </div>
              ) : !modalCompleted ? (
                <div className="mt-4 bg-[#F8FCFA] border border-[#B4DBDC] rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center shrink-0">
                      <FaLock />
                    </div>

                    <div>
                      <p className="font-black text-[#08566E]">
                        Review Locked
                      </p>

                      <p className="text-sm font-semibold text-[#06485C] mt-1">
                        The rating and review option will become available only after the work or service is completed.
                      </p>

                      <p className="text-xs font-bold text-[#08566E]/70 mt-2">
                        Current Status: {modalDetails.status}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          updateReviewInput(
                            modalDetails.bookingKey,
                            "rating",
                            star
                          )
                        }
                        className="bg-transparent border-none shadow-none p-0"
                      >
                        <FaStar
                          className={`text-3xl ${
                            star <= Number(modalReview.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={modalReview.review}
                    onChange={(event) =>
                      updateReviewInput(
                        modalDetails.bookingKey,
                        "review",
                        event.target.value
                      )
                    }
                    placeholder="Write your review here..."
                    rows={3}
                    className="w-full mt-4 p-4 rounded-2xl border border-[#6FA8AA] bg-[#E1E9E5] text-[#08566E] text-sm font-semibold outline-none focus:border-[#08566E] resize-none"
                  />

                  <button
                    type="button"
                    disabled={reviewLoading[modalDetails.bookingKey]}
                    onClick={() =>
                      submitReview(selectedBooking, selectedBookingIndex)
                    }
                    className="es-primary-cta mt-4 w-full px-5 py-3 rounded-2xl font-black text-sm disabled:opacity-60"
                  >
                    {reviewLoading[modalDetails.bookingKey]
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>
                </>
              )}
                        </div>
          </div>
        </div>
      )}

      {couponPopup && (
        <div className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-md flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-[#E1E9E5] rounded-[34px] border border-white/80 shadow-[0_30px_90px_rgba(0,0,0,0.35)] overflow-hidden text-[#08566E]">
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#9ECFD0] rounded-full blur-3xl opacity-80"></div>
            <div className="absolute -bottom-20 -left-16 w-52 h-52 bg-[#6FA8AA] rounded-full blur-3xl opacity-70"></div>

            <div className="relative p-6 text-center">
              <button
                type="button"
                onClick={() => setCouponPopup(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white border border-[#B4DBDC] flex items-center justify-center text-[#08566E] shadow-md"
              >
                <FaTimes />
              </button>

              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-4xl shadow-xl">
                <FaGift />
              </div>

              <h2 className="text-3xl font-black mt-5">
                Reward Unlocked!
              </h2>

              <p className="text-sm font-bold text-[#06485C] mt-2">
                Your E-SERVOO coupon is ready.
              </p>

              <div className="mt-5 bg-white rounded-3xl p-4 border border-[#B4DBDC] shadow-lg">
                {couponPopup.couponImage && (
                  <img
                    src={couponPopup.couponImage}
                    alt={couponPopup.couponTitle || "Coupon"}
                    className="w-full max-h-44 object-cover rounded-2xl mb-4 border border-[#B4DBDC]"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <p className="text-sm font-black text-[#0A7F88]">
                  {couponPopup.couponTitle || "Reward Coupon"}
                </p>

                <p className="text-4xl font-black mt-2 tracking-wider text-[#08566E]">
                  {couponPopup.couponCode || "NOCOUPON"}
                </p>

                <p className="text-xs font-bold mt-2 text-[#06485C]">
                  {couponPopup.couponDescription ||
                    "Use this coupon on your next booking."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCouponPopup(null)}
                className="mt-5 w-full bg-[#08566E] text-[#E1E9E5] px-5 py-3 rounded-2xl font-black shadow-xl"
              >
                Save to My Rewards
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyBookings;