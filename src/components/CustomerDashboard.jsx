import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    )

    setUser(savedUser)

  }, [])

  const handleLogout = () => {

    localStorage.removeItem("user")
    window.location.reload()

  }

  if (!user) return null

  return (

    <section className="bg-[#B4DBDC] text-slate-900 py-20 px-5">

      <div className="max-w-4xl mx-auto bg-[#9ECFD0] shadow-xl p-8 rounded-3xl">

        <div className="flex items-center gap-3 mb-8">

  <button
    onClick={() => navigate(-1)}
    className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-4 py-2 rounded-lg transition"
  >
    ← Back
  </button>

  <h2 className="text-4xl font-bold text-[#08566E]">
    Customer Dashboard
  </h2>

</div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-[#6A9A9A] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold">
              Name
            </h3>
            <p className="text-[#E1E9E5]">{user.name}</p>
          </div>

          <div className="bg-[#6A9A9A] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold">
              Email
            </h3>
           <p className="text-[#E1E9E5]">{user.email}</p>
          </div>

          <div className="bg-[#6A9A9A] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-[#08566E]">
              Phone
            </h3>
            <p className="text-[#E1E9E5]">{user.phone}</p>
          </div>

          <div className="bg-[#6A9A9A] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold">
              Account Status
            </h3>
            <p className="text-[#E1E9E5] font-semibold">
              Active
            </p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-[#08566E] text-[#E1E9E5] px-6 py-3 rounded-xl font-bold hover:bg-[#06485C] transition"
        >
          Logout
        </button>

      </div>

    </section>

  )

}

export default CustomerDashboard