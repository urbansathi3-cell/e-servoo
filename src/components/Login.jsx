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

    <section className="bg-black text-white min-h-screen flex justify-center items-center px-5">

      <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md">

        <h2 className="text-4xl font-bold text-blue-500 text-center mb-8">
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
            className="p-4 rounded-xl bg-black text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-xl bg-black text-white"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 py-4 rounded-xl font-bold hover:bg-blue-600"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-zinc-400">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={() => {

              setShowLogin(false)
              setShowRegister(true)

            }}
            className="text-blue-500 mt-2 font-bold hover:underline"
          >
            Create Account
          </button>

        </div>

      </div>

    </section>

  )

}

export default Login