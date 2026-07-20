import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/storage";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getStoredUser();
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
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
      <section className="min-h-screen bg-[#B4DBDC] text-[#08566E] flex items-center justify-center px-5">
        <div className="bg-[#E1E9E5] border border-[#6FA8AA] rounded-3xl p-8 text-center shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-black text-[#08566E]">
            Please Login First
          </h2>

          <p className="text-[#06485C] font-semibold mt-3">
            Your session was not found. Login again to view your dashboard.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="es-primary-cta mt-6 px-6 py-3 rounded-2xl font-black"
          >
            Go to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] min-h-screen py-20 px-5 pb-28">
      <div className="max-w-4xl mx-auto bg-[#E1E9E5]/90 shadow-xl p-6 md:p-8 rounded-3xl border border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="es-secondary-cta px-4 py-2 rounded-2xl font-black transition w-fit"
          >
            ← Back
          </button>

          <h2 className="text-3xl md:text-4xl font-black text-[#08566E]">
            Customer Dashboard
          </h2>
        </div>

        <div className="bg-[#08566E] rounded-3xl p-6 shadow-xl mb-6">
          <h3 className="text-2xl font-black text-[#E1E9E5]">
            👋 Welcome, {user.name || "User"}
          </h3>

          <p className="text-[#B4DBDC] font-semibold mt-2">
            Manage your profile, bookings, and service history.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/85 p-6 rounded-3xl shadow-md border border-[#B4DBDC]">
            <h3 className="text-sm font-black text-[#6FA8AA]">
              Name
            </h3>

            <p className="text-[#08566E] text-xl font-black mt-2">
              {user.name || "Not Available"}
            </p>
          </div>

          <div className="bg-white/85 p-6 rounded-3xl shadow-md border border-[#B4DBDC]">
            <h3 className="text-sm font-black text-[#6FA8AA]">
              Email
            </h3>

            <p className="text-[#08566E] text-xl font-black mt-2 break-all">
              {user.email || "Not Available"}
            </p>
          </div>

          <div className="bg-white/85 p-6 rounded-3xl shadow-md border border-[#B4DBDC]">
            <h3 className="text-sm font-black text-[#6FA8AA]">
              Phone
            </h3>

            <p className="text-[#08566E] text-xl font-black mt-2">
              {user.phone || "Not Available"}
            </p>
          </div>

          <div className="bg-white/85 p-6 rounded-3xl shadow-md border border-[#B4DBDC]">
            <h3 className="text-sm font-black text-[#6FA8AA]">
              Account Status
            </h3>

            <p className="text-green-700 text-xl font-black mt-2">
              Active
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white/85 p-6 rounded-3xl shadow-md border border-[#B4DBDC]">
          <h3 className="text-sm font-black text-[#6FA8AA]">
            Address
          </h3>

          <p className="text-[#08566E] text-lg font-bold mt-2">
            {user.address || "Address not added yet"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="es-primary-cta px-6 py-4 rounded-2xl font-black"
          >
            📖 My Bookings
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="es-secondary-cta px-6 py-4 rounded-2xl font-black"
          >
            👤 Edit Profile
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full bg-[#B84545] hover:bg-[#963838] text-[#E1E9E5] px-6 py-4 rounded-2xl font-black transition shadow-lg"
        >
          🚪 Logout
        </button>
      </div>
    </section>
  );
}

export default CustomerDashboard;