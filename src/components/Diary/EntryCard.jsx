import { useState } from "react";
import { toast } from "react-toastify";

const EntryCard = ({ entry }) => {
  const [error, setError] = useState(null);
  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const src = base64 ? `data:image/png;base64,${base64}` : entry.image;

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
            response_format: "b64_json",
          }),
        }
      );
      const data = await response.json();
      setBase64(data[0].b64_json);
    } catch (error) {
      setError(error);
      toast.error(`Failed to fetch AI image: ${error}`);
    } finally {
      setLoading(false);
    }
  };
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
