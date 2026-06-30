import { useNavigate } from "react-router-dom";

function Contact() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-[#B4DBDC] text-slate-900 p-4">

      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">
          Contact Us
        </h1>

      </div>

      <p>📞 +91 9583896129</p>
      <p>📧 urbansathi7@gmail.com</p>
      <p>📍 Rajgangpur, Odisha, India</p>

    </div>

  );
}

export default Contact;