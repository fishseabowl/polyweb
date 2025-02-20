import { useState, useEffect } from "react";
import { MarketWithCreator } from "./types";
import MarketList from "./App/MarketList";
import { useAccount } from "wagmi"; // Import wallet hook

const Question: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount(); // Get wallet info
  const [username, setUsername] = useState<string>("");

  const [question, setQuestion] = useState<MarketWithCreator>({
    id: "",
    title: "",
    description: "",
    expiration: "",
    creator: "",
  });

  const [questions, setQuestions] = useState<MarketWithCreator[]>([]); // Store submitted questions

  // 🔹 Fetch next available question ID from server
  useEffect(() => {
    const fetchNextQuestionId = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/next-question-id");
        const data = await response.json();
        if (data.success) {
          setQuestion((prev) => ({ ...prev, id: data.nextId }));
        }
      } catch (error) {
        console.error("Error fetching question ID:", error);
      }
    };

    fetchNextQuestionId();
  }, []);

  // 🔹 Verify wallet username
  useEffect(() => {
    if (isConnected && userAddress) {
      setUsername(userAddress); // Assuming username is wallet address
      setQuestion((prev) => ({ ...prev, creator: userAddress }));
    }
  }, [isConnected, userAddress]);

  // 🔹 Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!question.title || !question.expiration) {
      alert("Title and expiration date are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/save-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions([...questions, question]); // Save question in UI
        setQuestion({ id: "", title: "", description: "", expiration: "", creator: username });
        alert("Question created successfully!");
      } else {
        alert("Failed to save question.");
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create a Prediction Question</h2>

      {/* 🔹 Show Wallet Connection Status */}
      <p className="mb-2 text-gray-500">
        Wallet: {isConnected ? userAddress : "Not Connected"}
      </p>

      {/* 🔹 Form to Create a Question */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={question.title}
          onChange={handleChange}
          placeholder="Enter your prediction..."
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={question.description}
          onChange={handleChange}
          placeholder="Provide details (optional)..."
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="expiration"
          value={question.expiration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Submit Question
        </button>
      </form>

      {/* 🔹 Display Submitted Questions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Submitted Questions:</h3>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q.id} className="p-2 border rounded">
                <strong>{q.title}</strong> (Expires: {q.expiration})
                <p className="text-gray-600">{q.description}</p>
                <p className="text-gray-400">Created by: {q.creator}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Question;
