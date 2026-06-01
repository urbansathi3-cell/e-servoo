function Navbar() {
  return (
    <nav className="bg-black text-white p-5 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-orange-500">
        Urban Sathi
      </h1>

      <div className="flex gap-6">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  )
}

export default Navbar