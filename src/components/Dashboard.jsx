function Dashboard() {

  return (

    <section className="bg-black text-white py-20 px-5">

      <h2 className="text-5xl font-bold text-center text-blue-500 mb-12">
        Admin Dashboard
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl text-center">
          <h3 className="text-zinc-400">Total Workers</h3>
          <p className="text-4xl font-bold text-blue-500 mt-3">
            5
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl text-center">
          <h3 className="text-zinc-400">Pending Bookings</h3>
          <p className="text-4xl font-bold text-yellow-500 mt-3">
            0
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl text-center">
          <h3 className="text-zinc-400">Completed</h3>
          <p className="text-4xl font-bold text-green-500 mt-3">
            0
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl text-center">
          <h3 className="text-zinc-400">Busy Workers</h3>
          <p className="text-4xl font-bold text-red-500 mt-3">
            0
          </p>
        </div>

      </div>

    </section>

  )

}

export default Dashboard