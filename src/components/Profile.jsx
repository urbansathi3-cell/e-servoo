import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "",
    line1: "",
    line2: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const localAddresses =
      JSON.parse(localStorage.getItem("savedAddresses")) || [];

    setUser(storedUser);

    let initialAddresses = localAddresses;

    if (initialAddresses.length === 0 && storedUser?.address) {
      initialAddresses = [
        {
          label: "Home",
          line1: storedUser.address,
          line2: "",
        },
      ];

      localStorage.setItem(
        "savedAddresses",
        JSON.stringify(initialAddresses)
      );
    }

    setSavedAddresses(initialAddresses);

    const storedDefaultIndex =
      Number(localStorage.getItem("defaultAddressIndex")) || 0;

    setDefaultAddressIndex(storedDefaultIndex);
  }, []);

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const getFullAddress = (address) => {
    if (!address) return "";

    return `${address.line1}${address.line2 ? ", " + address.line2 : ""}`;
  };

  const addNewAddress = () => {
    if (!newAddress.label.trim()) {
      alert("Please enter address label like Home, Office or Hostel");
      return;
    }

    if (!newAddress.line1.trim()) {
      alert("Please enter Address Line 1");
      return;
    }

    const updatedAddresses = [
      ...savedAddresses,
      {
        label: newAddress.label,
        line1: newAddress.line1,
        line2: newAddress.line2,
      },
    ];

    localStorage.setItem(
      "savedAddresses",
      JSON.stringify(updatedAddresses)
    );

    setSavedAddresses(updatedAddresses);

    setNewAddress({
      label: "",
      line1: "",
      line2: "",
    });

    setShowAddressForm(false);

    alert("Address Added Successfully");
  };

  const setDefaultAddress = async (index) => {
    const selectedAddress = savedAddresses[index];

    if (!selectedAddress) return;

    const finalAddress = getFullAddress(selectedAddress);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
        {
          method: "POST",
          body: JSON.stringify({
            action: "updateAddress",
            email: user.email,
            address: finalAddress,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        const updatedUser = {
          ...user,
          address: finalAddress,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        localStorage.setItem(
          "defaultAddressIndex",
          String(index)
        );

        setUser(updatedUser);
        setDefaultAddressIndex(index);

        alert("Default Address Updated Successfully");
      } else {
        alert("Failed to update default address");
      }
    } catch (error) {
      console.log(error);
      alert("Error Updating Address");
    }
  };

  const deleteAddress = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    const updatedAddresses = savedAddresses.filter(
      (_, i) => i !== index
    );

    localStorage.setItem(
      "savedAddresses",
      JSON.stringify(updatedAddresses)
    );

    setSavedAddresses(updatedAddresses);

    if (defaultAddressIndex === index) {
      localStorage.setItem("defaultAddressIndex", "0");
      setDefaultAddressIndex(0);
    }

    alert("Address Deleted");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#B4DBDC] flex items-center justify-center px-5">
        <div className="bg-[#08566E] text-[#E1E9E5] p-8 rounded-3xl text-center">
          <h2 className="text-2xl font-bold">
            No user found
          </h2>

          <button
            onClick={() => navigate("/")}
            className="mt-5 bg-[#E1E9E5] text-[#08566E] px-6 py-3 rounded-xl font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1E9E5] via-[#B4DBDC] to-[#9ECFD0] text-[#08566E] p-4 pb-28">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-4 py-2 rounded-lg"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl font-extrabold text-[#08566E]">
            My Profile
          </h1>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.4fr] gap-6">

          {/* PROFILE CARD */}
          <div className="bg-[#08566E] rounded-3xl p-6 shadow-2xl border border-[#6FA8AA]/70 h-fit">

            <div className="w-24 h-24 rounded-full bg-[#E1E9E5] flex items-center justify-center mx-auto text-[#08566E] text-4xl font-extrabold shadow-xl">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="text-3xl font-extrabold text-[#E1E9E5] text-center mt-5">
              {user.name}
            </h2>

            <p className="text-[#B4DBDC] text-center mt-1">
              E-SERVOO Customer
            </p>

            <div className="mt-8 space-y-4">

              <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Phone
                </p>

                <p className="text-[#08566E] font-bold">
                  {user.phone}
                </p>
              </div>

              <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Email
                </p>

                <p className="text-[#08566E] font-bold break-all">
                  {user.email}
                </p>
              </div>

              <div className="bg-[#E1E9E5]/95 rounded-2xl p-4">
                <p className="text-sm text-[#6FA8AA] font-bold">
                  Default Address
                </p>

                <p className="text-[#08566E] font-bold">
                  {user.address || "No default address selected"}
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* ADDRESS MANAGER */}
            <div className="bg-[#9ECFD0] rounded-3xl p-6 shadow-2xl border border-[#6FA8AA]/70">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-[#08566E] font-bold tracking-widest text-sm uppercase">
                    Saved Address
                  </p>

                  <h2 className="text-3xl font-extrabold text-[#08566E]">
                    Manage Addresses
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <FaPlus />
                  Add More Address
                </button>
              </div>

              {showAddressForm && (
                <div className="bg-[#E1E9E5]/90 border border-[#6FA8AA] rounded-3xl p-5 mb-6">

                  <h3 className="text-2xl font-extrabold text-[#08566E] mb-4">
                    Add New Address
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="label"
                      placeholder="Address Label e.g. Home, Office"
                      value={newAddress.label}
                      onChange={handleNewAddressChange}
                      className="w-full p-4 rounded-2xl bg-white text-[#08566E] border border-[#6FA8AA] outline-none"
                    />

                    <input
                      type="text"
                      name="line1"
                      placeholder="Address Line 1"
                      value={newAddress.line1}
                      onChange={handleNewAddressChange}
                      className="w-full p-4 rounded-2xl bg-white text-[#08566E] border border-[#6FA8AA] outline-none"
                    />

                    <input
                      type="text"
                      name="line2"
                      placeholder="Address Line 2 / Landmark"
                      value={newAddress.line2}
                      onChange={handleNewAddressChange}
                      className="md:col-span-2 w-full p-4 rounded-2xl bg-white text-[#08566E] border border-[#6FA8AA] outline-none"
                    />
                  </div>

                  <button
                    onClick={addNewAddress}
                    className="mt-5 w-full bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] py-4 rounded-2xl font-extrabold"
                  >
                    Save Address
                  </button>
                </div>
              )}

              {savedAddresses.length === 0 ? (
                <div className="bg-[#E1E9E5]/90 rounded-3xl p-6 text-center">
                  <p className="text-[#08566E] font-bold">
                    No saved address found.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {savedAddresses.map((addressItem, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl p-5 border shadow-lg ${
                        defaultAddressIndex === index
                          ? "bg-[#08566E] border-[#08566E]"
                          : "bg-[#E1E9E5]/95 border-[#6FA8AA]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <h3
                            className={`text-xl font-extrabold ${
                              defaultAddressIndex === index
                                ? "text-[#E1E9E5]"
                                : "text-[#08566E]"
                            }`}
                          >
                            📍 {addressItem.label}
                          </h3>

                          <p
                            className={`mt-3 font-semibold ${
                              defaultAddressIndex === index
                                ? "text-[#B4DBDC]"
                                : "text-[#08566E]"
                            }`}
                          >
                            {addressItem.line1}
                          </p>

                          {addressItem.line2 && (
                            <p
                              className={`mt-1 ${
                                defaultAddressIndex === index
                                  ? "text-[#B4DBDC]"
                                  : "text-[#08566E]/80"
                              }`}
                            >
                              {addressItem.line2}
                            </p>
                          )}
                        </div>

                        {defaultAddressIndex === index && (
                          <FaCheckCircle className="text-[#E1E9E5] text-2xl" />
                        )}

                      </div>

                      <div className="flex flex-wrap gap-3 mt-5">

                        <button
                          onClick={() => setDefaultAddress(index)}
                          className={`px-4 py-2 rounded-full font-bold ${
                            defaultAddressIndex === index
                              ? "bg-[#E1E9E5] text-[#08566E]"
                              : "bg-[#08566E] text-[#E1E9E5]"
                          }`}
                        >
                          {defaultAddressIndex === index
                            ? "Default"
                            : "Set Default"}
                        </button>

                        <button
                          onClick={() => deleteAddress(index)}
                          className="px-4 py-2 rounded-full bg-red-500 text-white font-bold flex items-center gap-2"
                        >
                          <FaTrash />
                          Delete
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* MENU BUTTONS */}
            <div className="space-y-4">

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

        </div>

      </div>

    </div>
  );
}

export default Profile;