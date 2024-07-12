import { useState } from "react";
import { toast } from "react-toastify";

const EntryCard = ({ entry }) => {
  const [error, setError] = useState(null);
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  // const src = base64 ? `data:image/png;base64,${base64}` : entry.image;
  const src = aiImageUrl ? aiImageUrl : entry.image;
  const fetchAIImage = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://gen-ai-wbs-consumer-api.onrender.com/api/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            mode: "production",
            provider: "open-ai",
            Authorization: "g1tktjt6lxrck90us9748q",
          },
          body: JSON.stringify({
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
            prompt: entry.content,
            response_format: "url",
          }),
        }
      );
      const data = await response.json();
      console.log(data[0]);
      setAiImageUrl(data[0].url);
      editImage(data[0].url)
    } catch (error) {
      setError(error);
      toast.error(`Failed to fetch AI image`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const editImage = async (src) => {
    const response = await fetch(
      `${import.meta.env.VITE_NOTES_API}/entries/${entry._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...entry,
          image: src,
        }),
      }
    );
    if (!response.ok) setError("Failed to update image");
    const data = await response.json();
    console.log("edit", data);
  }

  return (
    <div className="shadow-xl card bg-base-100">
      <figure className="h-48 bg-white">
        <img
          src={src}
          alt={entry.title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="h-56 card-body">
        <h2 className="card-title">{entry.title}</h2>
        <h3 className="font-bold">{new Date(entry.date).toDateString()}</h3>
        <p className="truncate text-wrap">{entry.content}</p>
      </div>
      <button
        className="text-white bg-purple-500 btn hover:bg-purple-400"
        onClick={fetchAIImage}
        disabled={loading}
      >
        {loading ? "Loading..." : "Generate AI Image"}
      </button>
    </div>
  );
};

export default EntryCard;
