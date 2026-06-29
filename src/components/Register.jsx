import { useState } from "react"

function Register({
setShowRegister,
setShowLogin
}) {

const [name, setName] = useState("")
const [phone, setPhone] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

const handleRegister = async (e) => {


e.preventDefault()

try {

  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbzrxIGOLW5qH-brmoLxLjWuF3k3RWgiMOeCWvAass6IKSBzL1c9cUW-JlSFKOufpJUvUA/exec",
    {
      method: "POST",
      body: JSON.stringify({
        action: "register",
        name,
        phone,
        email,
        password
      })
    }
  )

  const data = await res.json()

  if (data.success) {

    alert("Account Created Successfully")

    setShowRegister(false)
    setShowLogin(true)

  } else {

    alert(data.message || "Registration Failed")

  }

} catch (error) {

  console.log(error)
  alert("Registration Failed")

}


}

return (


<section className="bg-[#B4DBDC] text-slate-900 min-h-screen flex justify-center items-center px-5">

  <div className="bg-white shadow-xl p-8 rounded-3xl w-full max-w-md">

    <h2 className="text-4xl font-bold text-blue-500 text-center mb-8">
      Create Account
    </h2>

    <form
      onSubmit={handleRegister}
      className="flex flex-col gap-4"
    >

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-xl bg-[#B4DBDC] border border-zinc-700 text-slate-900"
        required
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-3 rounded-xl bg-[#B4DBDC] border border-zinc-700 text-slate-900"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-xl bg-[#B4DBDC] border border-zinc-700 text-slate-900"
        required
      />

      <input
        type="password"
        placeholder="Create Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-xl bg-[#B4DBDC] border border-zinc-700 text-slate-900"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 py-4 rounded-xl font-bold hover:bg-[#08566E] transition"
      >
        Create Account
      </button>

    </form>

    <div className="text-center mt-6">

      <p className="text-zinc-400">
        Already have an account?
      </p>

      <button
        type="button"
        onClick={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
        className="text-blue-500 mt-2 font-bold hover:underline"
      >
        Login
      </button>

    </div>

  </div>

</section>


)

}

export default Register
