import { useState } from "react"

function Login({
  setIsLoggedIn,
  setShowLogin,
  setShowRegister
}) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec?email=${email}&password=${password}`
      )

      const data = await res.json()

      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        )

        setIsLoggedIn(true)

      } else {

        alert("Invalid Email or Password")

      }

    } catch (error) {

      alert("Login Failed")

    }

  }

  return (

    <section className="bg-gradient-to-b from-[#E1E9E5] via-[#B4DBDC] to-[#A4D1D2] min-h-screen flex justify-center items-center px-5">

      <div className="bg-[#6FA8AE] shadow-2xl p-8 rounded-3xl w-full max-w-md border border-[#5E9AA1]">

        <h2 className="text-4xl font-bold text-[#08566E] text-center mb-8">
          Customer Login
        </h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          <input
            type="email"
            placeholder="Email"
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

        <div className="text-center mt-6">

          <p className="text-[#E1E9E5]">
            Don't have an account?
          </p>
          
          <button
            type="button"
            onClick={() => {

              setShowLogin(false)
              setShowRegister(true)

            }}
            className="text-[#08566E] mt-2 font-bold hover:underline"
          >
            Create Account
          </button>

        </div>

      </div>

    </section>

  )

}

export default Login