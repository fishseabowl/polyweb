import { useState } from "react";
import {MarketWithCreator} from "./types";
import MarketList from "./App/MarketList";


const Question: React.FC = () => {
  const [question, setQuestion] = useState<MarketWithCreator>({
    id: "",
    title: "",
    description: "",
    expiration: "",
    creator: "",
  });

  const [questions, setQuestions] = useState<MarketWithCreator[]>([]); // Store submitted questions

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.title || !question.expiration) return;

    setQuestions([...questions, question]); // Save question
    setQuestion({id: "", title: "", description: "", expiration: "" , creator:""}); // Reset form
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create a Prediction Question</h2>
      
      {/* Form to Create a Question */}
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

      {/* Display Submitted Questions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Submitted Questions:</h3>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q, index) => (
              <li key={index} className="p-2 border rounded">
                <strong>{q.title}</strong> (Expires: {q.expiration})
                <p className="text-gray-600">{q.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Question;