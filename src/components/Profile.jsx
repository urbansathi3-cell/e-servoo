import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#B4DBDC] text-slate-900 p-4">

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="space-y-4">

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-slate-800 p-4 rounded-xl text-left"
        >
          👤 Customer Dashboard
        </button>

        <button
          onClick={() => navigate("/bookings")}
          className="w-full bg-slate-800 p-4 rounded-xl text-left"
        >
          📖 My Bookings
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="w-full bg-slate-800 p-4 rounded-xl text-left"
        >
          📞 Contact Us
        </button>

        <button
          onClick={() => navigate("/terms")}
          className="w-full bg-slate-800 p-4 rounded-xl text-left"
        >
          📜 Terms & Conditions
        </button>

        <button
          onClick={logout}
          className="w-full bg-red-600 p-4 rounded-xl"
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;