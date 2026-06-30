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

    <section className="bg-gradient-to-b from-[#E1E9E5] via-[#B4DBDC] to-[#A4D1D2] min-h-screen flex justify-center items-center px-5">

      <div className="bg-[#6FA8AE] shadow-2xl p-8 rounded-3xl w-full max-w-md border border-[#5E9AA1]">

        <h2 className="text-4xl font-bold text-[#08566E] text-center mb-8">
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
            className="w-full p-3 rounded-xl bg-[#E1E9E5] border border-[#5E9AA1] text-[#08566E] placeholder:text-slate-500 outline-none focus:border-[#08566E]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#E1E9E5] border border-[#5E9AA1] text-[#08566E] placeholder:text-slate-500 outline-none focus:border-[#08566E]"
            required
          />

          <button
            type="submit"
            className="bg-[#08566E] text-white py-4 rounded-xl font-bold hover:bg-[#06485C] transition"
          >
            Login
          </button>

        </form>

      </div>

    </section>

  )

}

export default WorkerLogin