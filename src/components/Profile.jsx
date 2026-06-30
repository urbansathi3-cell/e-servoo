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
    <div className="min-h-screen bg-[#B4DBDC] text-[#08566E] p-4">

      <div className="flex items-center gap-3 mb-6">

  <button
    onClick={() => navigate(-1)}
    className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-4 py-2 rounded-lg"
  >
    ← Back
  </button>

  <h1 className="text-3xl font-bold text-[#08566E]">
    My Profile
  </h1>

</div>

      <div className="space-y-4">

        <div className="bg-[#6FA8AA] p-5 rounded-2xl shadow-md">

  <h2 className="font-bold text-[#E1E9E5] mb-3">
    📍 My Address
  </h2>

  <textarea
    value={address}
    onChange={(e) =>
      setAddress(e.target.value)
    }
    className="w-full p-3 rounded-lg bg-[#E1E9E5] text-[#08566E] border border-[#5F9FA2]"
    rows={4}
    placeholder="Enter Full Address"
  />

  <button
    onClick={saveAddress}
    className="mt-3 bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-5 py-2 rounded-lg"
  >
    Save Address
  </button>

</div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-[#6FA8AA] text-[#E1E9E5] p-4 rounded-2xl text-left hover:bg-[#5F9FA2] transition"
        >
          👤 Customer Dashboard
        </button>

        <button
          onClick={() => navigate("/bookings")}
          className="w-full bg-[#6FA8AA] text-[#E1E9E5] p-4 rounded-2xl text-left hover:bg-[#5F9FA2] transition"
        >
          📖 My Bookings
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="w-full bg-[#6FA8AA] text-[#E1E9E5] p-4 rounded-2xl text-left hover:bg-[#5F9FA2] transition"
        >
          📞 Contact Us
        </button>

        <button
          onClick={() => navigate("/terms")}
          className="w-full bg-[#6FA8AA] text-[#E1E9E5] p-4 rounded-2xl text-left hover:bg-[#5F9FA2] transition"
        >
          📜 Terms & Conditions
        </button>

        <button
          onClick={logout}
          className="w-full bg-[#B84545] hover:bg-[#963838] text-[#E1E9E5] p-4 rounded-2xl transition"
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;