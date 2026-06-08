import { useState } from "react"

function ReviewForm({ worker }) {

  const [rating, setRating] = useState("")
  const [review, setReview] = useState("")

  const submitReview = async (e) => {

    e.preventDefault()

    const user = JSON.parse(
      localStorage.getItem("user")
    )

    const res = await fetch(
      "YOUR_SCRIPT_URL",
      {
        method: "POST",
        body: JSON.stringify({
          action: "review",
          worker,
          customer: user.name,
          rating,
          review
        })
      }
    )

    const data = await res.json()

    if (data.success) {

      alert("Review Submitted")

      setRating("")
      setReview("")

    }

  }

  return (

    <form
      onSubmit={submitReview}
      className="bg-zinc-900 p-6 rounded-2xl mt-6"
    >

      <h3 className="text-2xl font-bold text-blue-500">
        Rate Worker
      </h3>

      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full mt-4 p-3 rounded-xl bg-black text-white"
        required
      />

      <textarea
        placeholder="Write Review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full mt-4 p-3 rounded-xl bg-black text-white"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 px-6 py-3 rounded-xl mt-4"
      >
        Submit Review
      </button>

    </form>

  )

}

export default ReviewForm