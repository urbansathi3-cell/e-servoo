import { useState } from "react"

function WorkerLogin({ setWorkerLoggedIn }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?workerEmail=${email}&workerPassword=${password}`
      )

      const data = await res.json()

      if (data.success) {

        localStorage.setItem(
          "worker",
          JSON.stringify(data.worker)
        )

        setWorkerLoggedIn(true)

      } else {

        alert("Invalid Worker Login")

      }

    } catch (error) {

      alert("Login Failed")

      console.log(error)

    }

  }

  return (

    <section className="bg-[#B4DBDC] text-slate-900 min-h-screen flex justify-center items-center px-5">

      <div className="bg-white shadow-xl p-8 rounded-3xl w-full max-w-md border border-blue-500">

        <h2 className="text-4xl font-bold text-blue-500 text-center mb-8">
          Worker Login
        </h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          <input
            type="email"
            placeholder="Worker Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#B4DBDC] text-slate-900"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#B4DBDC] text-slate-900"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 py-4 rounded-xl font-bold hover:bg-[#08566E]"
          >
            Login
          </button>

        </form>

      </div>

    </section>

  )

}

export default WorkerLogin