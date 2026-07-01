import { useNavigate } from "react-router-dom";

function Contact() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-[#B4DBDC] text-slate-900 p-4">

      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate(-1)}
          className="bg-[#08566E] hover:bg-[#06485C] text-[#E1E9E5] px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-[#08566E]">
          Contact Us
        </h1>

      </div>

      <div className="bg-[#6FA8AA] p-6 rounded-2xl shadow-md border border-[#5F9FA2] space-y-4">

  <p className="text-[#E1E9E5] text-lg">
    📞 +91 9583896129
  </p>

  <p className="text-[#E1E9E5] text-lg">
    📧 urbansathi7@gmail.com
  </p>

  <p className="text-[#E1E9E5] text-lg">
    📍 Rajgangpur, Odisha, India
  </p>

</div>

    </div>

  );
}

export default Contact;