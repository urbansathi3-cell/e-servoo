import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGift, FaTicketAlt } from "react-icons/fa";
import {
  getStoredUser,
  getStoredToken,
  saveJsonToStorage,
  safeJsonParse,
} from "../utils/storage";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec";

function Profile() {
  const navigate = useNavigate();

  const user = getStoredUser();

  const [address, setAddress] = useState(user?.address || "");
  const [saving, setSaving] = useState(false);
  const [myCoupons, setMyCoupons] = useState([]);

  useEffect(() => {
    const savedCoupons = safeJsonParse(localStorage.getItem("myCoupons"), []);

    if (Array.isArray(savedCoupons)) {
      setMyCoupons(savedCoupons);
    } else {
      setMyCoupons([]);
    }
  }, []);

  const saveAddress = async () => {
    if (!user) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your full address.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "updateAddress",
          token: getStoredToken(),
          email: user.email || "",
          phone: user.phone || "",
          address: address.trim(),
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        alert(data.message || "Failed to update address.");
        setSaving(false);
        return;
      }

      const updatedUser = {
        ...user,
        address: address.trim(),
      };

      saveJsonToStorage("user", updatedUser);

      alert("Address Updated Successfully");
      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
      alert("Error updating address.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("reviewedBookings");
    localStorage.removeItem("savedAddresses");
    localStorage.removeItem("defaultAddressIndex");

    navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#B4DBDC] text-[#08566E] p-5 flex items-center justify-center">
        <div className="bg-[#E1E9E5] rounded-3xl p-8 text-center shadow-xl border border-[#6FA8AA] max-w-md w-full">
          <h1 className="text-3xl font-black text-[#08566E]">
            Please Login First
          </h1>

          <p className="text-[#06485C] font-semibold mt-3">
            Your session was not found. Login again to view your profile.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="es-primary-cta mt-6 px-6 py-3 rounded-2xl font-black"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] p-4 pb-28">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="es-secondary-cta px-4 py-2 rounded-2xl font-black"
          >
            ← Back
          </button>

          <h1 className="text-3xl md:text-4xl font-black text-[#08566E]">
            My Profile
          </h1>
        </div>

        <div className="bg-[#E1E9E5]/90 border border-white/80 rounded-3xl p-5 shadow-xl mb-5">
          <h2 className="text-2xl font-black text-[#08566E]">
            👤 {user.name || "User"}
          </h2>

          <p className="text-[#06485C] font-semibold mt-2">
            📞 {user.phone || "Phone not available"}
          </p>

          <p className="text-[#06485C] font-semibold mt-1">
            ✉️ {user.email || "Email not available"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#E1E9E5]/90 p-5 rounded-3xl shadow-xl border border-white/80">
            <h2 className="font-black text-[#08566E] mb-3 text-xl">
              📍 My Address
            </h2>

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full p-3 rounded-2xl bg-[#E1E9E5] text-[#08566E] border border-[#6FA8AA] font-semibold outline-none focus:border-[#08566E]"
              rows={4}
              placeholder="Enter full address"
            />

            <button
              type="button"
              onClick={saveAddress}
              disabled={saving}
              className={`es-primary-cta mt-3 px-5 py-3 rounded-2xl font-black ${
                saving
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-[#08566E] text-[#E1E9E5] hover:bg-[#06485C]"
              }`}
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/rewards")}
            className="w-full text-left bg-[#E1E9E5]/90 border border-white/80 rounded-3xl p-5 shadow-xl hover:bg-white active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#08566E] text-[#E1E9E5] flex items-center justify-center text-xl shadow-md">
                <FaGift />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-[#08566E]">
                  My Rewards
                </h2>

                <p className="text-[#06485C] text-sm font-semibold mt-1">
                  View your saved coupons in one place.
                </p>
              </div>

              <div className="bg-[#08566E] text-[#E1E9E5] px-3 py-1.5 rounded-full text-xs font-black">
                {myCoupons.length}
              </div>
            </div>

            <div className="mt-4 bg-white/75 rounded-2xl p-4 border border-[#B4DBDC]">
              {myCoupons.length === 0 ? (
                <div className="flex items-center gap-3">
                  <FaTicketAlt className="text-2xl text-[#08566E]" />

                  <div>
                    <p className="font-black text-[#08566E]">
                      No coupons yet
                    </p>

                    <p className="text-xs font-semibold text-[#06485C] mt-1">
                      Complete a booking and confirm payment to unlock rewards.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-black text-[#08566E]">
                    {myCoupons.length} coupon saved
                  </p>

                  <p className="text-xs font-semibold text-[#06485C] mt-1">
                    Tap here to open your coupon wallet.
                  </p>
                </div>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full bg-[#E1E9E5]/90 text-[#08566E] p-4 rounded-3xl text-left hover:bg-white transition font-black shadow-lg border border-white/80"
          >
            👤 Customer Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="w-full bg-[#E1E9E5]/90 text-[#08566E] p-4 rounded-3xl text-left hover:bg-white transition font-black shadow-lg border border-white/80"
          >
            📖 My Bookings
          </button>

          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="w-full bg-[#E1E9E5]/90 text-[#08566E] p-4 rounded-3xl text-left hover:bg-white transition font-black shadow-lg border border-white/80"
          >
            📞 Contact Us
          </button>

          <button
            type="button"
            onClick={() => navigate("/terms")}
            className="w-full bg-[#E1E9E5]/90 text-[#08566E] p-4 rounded-3xl text-left hover:bg-white transition font-black shadow-lg border border-white/80"
          >
            📜 Terms & Conditions
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full bg-[#B84545] hover:bg-[#963838] text-[#E1E9E5] p-4 rounded-3xl transition font-black shadow-lg"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;