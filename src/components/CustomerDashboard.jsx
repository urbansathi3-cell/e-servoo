import { useEffect, useState } from "react"

function CustomerDashboard() {

  const [user, setUser] = useState(null)

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

    <section className="bg-black text-white py-20 px-5">

      <div className="max-w-4xl mx-auto bg-zinc-900 p-8 rounded-3xl">

        <h2 className="text-4xl font-bold text-blue-500 mb-8">
          Customer Dashboard
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-zinc-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold">
              Name
            </h3>
            <p>{user.name}</p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold">
              Email
            </h3>
            <p>{user.email}</p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold">
              Phone
            </h3>
            <p>{user.phone}</p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold">
              Account Status
            </h3>
            <p className="text-green-500">
              Active
            </p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 px-6 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

    </section>

  )

}

export default CustomerDashboard