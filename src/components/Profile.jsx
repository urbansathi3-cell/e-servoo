import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

const [address, setAddress] = useState(
  user?.address || ""
);

  const saveAddress = async () => {

  try {

    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
      {
        method: "POST",
        body: JSON.stringify({
          action: "updateAddress",
          email: user.email,
          address: address
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          address: address
        })
      );

      alert("Address Updated Successfully");

    } else {

      alert("Failed");

    }

  } catch (error) {

    console.log(error);

    alert("Error Updating Address");

  }

};

const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#B4DBDC] text-slate-900 p-4">

      <div className="flex items-center gap-3 mb-6">

  <button
    onClick={() => navigate(-1)}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
  >
    ← Back
  </button>

  <h1 className="text-3xl font-bold">
    My Profile
  </h1>

</div>

      <div className="space-y-4">

        <div className="bg-slate-800 p-4 rounded-xl">

  <h2 className="font-bold mb-3">
    📍 My Address
  </h2>

  <textarea
    value={address}
    onChange={(e) =>
      setAddress(e.target.value)
    }
    className="w-full p-3 rounded-lg text-black"
    rows={4}
    placeholder="Enter Full Address"
  />

  <button
    onClick={saveAddress}
    className="mt-3 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
  >
    Save Address
  </button>

</div>

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