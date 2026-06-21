function LanguageSelection({ setLanguageSelected, changeLanguage }) {

  const selectLanguage = (lang) => {

    changeLanguage(lang)
    setLanguageSelected(true)

  }

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white">

      <h1 className="text-4xl font-bold mb-10">
        Select Language
      </h1>

      <div className="flex gap-4">

        <button
          onClick={() => selectLanguage("en")}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          English
        </button>

        <button
          onClick={() => selectLanguage("hi")}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          हिन्दी
        </button>

        <button
          onClick={() => selectLanguage("od")}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          ଓଡ଼ିଆ
        </button>

      </div>

    </div>
  )
}

export default LanguageSelection