import { useState, useEffect, useMemo } from "react";
import { MarketWithCreator } from "./types";

interface QuestionProps {
  userAddr: string; // Get username from Page.tsx
}

const Question: React.FC<QuestionProps> = ({ userAddr }) => {
  const [question, setQuestion] = useState<MarketWithCreator>({
    id: "",
    title: "",
    description: "",
    expiration: "",
    creator: "",
  });

  const shortenedAddress = useMemo(() => {
    if (!userAddr) return "";
    return `${userAddr.slice(0, 6)}...${userAddr.slice(-4)}`;
  }, [userAddr]);

  const [questions, setQuestions] = useState<MarketWithCreator[]>([]); // Store submitted questions

  const fetchNextQuestionId = async (): Promise<string | null> => {
    try {
      const response = await fetch("http://localhost:4000/api/next-question-id");
      const data = await response.json();
      return data.nextId || null;
    } catch (error) {
      console.error("Error fetching question ID:", error);
      return null;
    }
  };

  // 🔹 Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userAddr) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!question.title || !question.expiration) {
      alert("Title and expiration date are required.");
      return;
    }

    // 🔹 Retrieve next question ID before submitting
    const nextId = await fetchNextQuestionId();
    if (!nextId) {
      alert("Failed to retrieve question ID.");
      return;
    }
    // 🔹 Save question to server
    question.id = nextId;
    question.creator = userAddr;

    try {
      const response = await fetch("http://localhost:4000/api/save-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (data.success) {
        setQuestions([...questions, question]); // Save question in UI
        setQuestion({
          id: "",
          title: "",
          description: "",
          expiration: "",
          creator: userAddr,
        });
        alert("Question created successfully!");
      } else {
        alert(
          `Failed to save question. Server says: ${data.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Create a New Question
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={question.title}
          onChange={handleChange}
          placeholder="Enter question title"
          className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />

        <textarea
          name="description"
          value={question.description}
          onChange={handleChange}
          placeholder="Enter question description"
          className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        ></textarea>

        <input
          type="date"
          name="expiration"
          value={question.expiration}
          onChange={handleChange}
          className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
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
                <p className="text-gray-600"><strong>{q.title}</strong> (Expires: {q.expiration}) </p>
                <p className="text-gray-400">{q.description}</p>
                <p className="text-gray-400">Created by: {shortenedAddress}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Question;
