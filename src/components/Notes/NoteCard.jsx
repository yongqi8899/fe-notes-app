import { useState } from "react";
import { toast } from "react-toastify";

const NoteCard = ({ note }) => {
  const [error, setError] = useState(null);
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [loadingAiImg, setloadingAiImg] = useState(false);
  const [loadingAiNote, setloadingAiNote] = useState(false);

  const src = aiImageUrl ? aiImageUrl : note.image;
  const aiNoteSrc = aiNote ? aiNote : note.content;
  const fetchAIImage = async (e) => {
    e.preventDefault();
    try {
      setloadingAiImg(true);
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
            prompt: note.content,
            response_format: "url",
          }),
        }
      );
      const data = await response.json();
      const imageUrl = data[0].url;
      setAiImageUrl(imageUrl);
      editImage(imageUrl);
      toast.success(`AI node is ready`);
    } catch (error) {
      setError(error);
      toast.error(`Failed to fetch AI node`);
      console.log(error);
    } finally {
      setloadingAiImg(false);
    }
  };
  const editImage = async (src) => {
    const response = await fetch(
      `${import.meta.env.VITE_NOTES_API}/notes/${note._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...note,
          image: src,
        }),
      }
    );
    if (!response.ok) setError("Failed to update image");
    const data = await response.json();
    console.log("edit", data);
  };

  const fetchAINote = async (e) => {
    e.preventDefault();
    setloadingAiNote(true);
    try {
      const response = await fetch(
        "https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            mode: "production",
            provider: "open-ai",
            Authorization: "g1tktjt6lxrck90us9748q",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            // stream: streamValue,
            messages: [
              {
                role: "system",
                content:
                  "You are a software developer student that only speaks in JS, HTML, CSS, Typscript, React and so on. You are building a chatbot that can help users with their notes. The user will provide a prompt and the chatbot will generate a note based on the prompt. The user can also ask the chatbot to read the note. The chatbot can also generate an image based on the note. The chatbot can also generate a summary of the note. The chatbot can also generate a question based on the note.",
              },
              {
                role: "user",
                content: `write a note about${note.title}, it schould be include intruduction ${note.title}, ${note.content} and example about ${note.title}. `,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      let aiNode = data.message.content;
      setAiNote(aiNode);
      console.log("aiNode", aiNode);
    } catch (error) {
      setError(error);
      toast.error(`Failed to fetch AI image`);
      console.log(error);
    } finally {
      setloadingAiNote(false);
    }
  };
  return (
    <div className="shadow-xl card bg-base-100">
      <figure className="h-48 bg-white">
        <img
          src={src}
          alt={note.title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="h-56 card-body">
        <h2 className="card-title">{note.title}</h2>
        <p className="truncate text-wrap">{note.content}</p>
      </div>
      <div className="flex justify-between">
        <button
          className="text-white bg-purple-500 btn-sm btn hover:bg-purple-400"
          onClick={fetchAIImage}
          disabled={loadingAiImg}
        >
          {loadingAiImg ? "loading..." : "AI Image"}
        </button>
        <button
          className="text-white bg-purple-500 btn-sm btn hover:bg-purple-400"
          onClick={fetchAINote}
          disabled={loadingAiNote}
        >
          {loadingAiNote ? "loading..." : "AI Note"}
        </button>
        <button className="text-white bg-purple-500 btn-sm btn hover:bg-purple-400">
          AI Read
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
