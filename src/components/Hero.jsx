import { translations } from "../translations";
function Hero({ language }) {

  const t = translations[language];

  return (

    <section className="bg-[#B4DBDC] min-h-[70vh] flex flex-col items-center justify-start text-center px-5 pt-20">

  <p className="mt-6 text-2xl font-bold text-[#08566E]">
    {t.heroTitle}
  </p>

  <p className="mt-6 text-lg text-slate-700 max-w-2xl">
    {t.heroDescription}
  </p>

  <div className="flex flex-wrap justify-center gap-6 mt-10">

    <a
      href="#workers"
      className="bg-[#08566E] px-8 py-4 rounded-2xl text-white font-bold hover:bg-[#06485C] transition"
    >
      {t.bookProfessional}
    </a>

    <a
      href="#services"
      className="border-2 border-[#08566E] px-8 py-4 rounded-2xl text-[#08566E] font-bold hover:bg-[#08566E] hover:text-white transition"
    >
      {t.exploreServices}
    </a>

  </div>

</section>

  )
}

export default Hero