"use client";
import { useState, useEffect } from "react";
import { Market } from "./types";
import { AccountInterface, Contract, RpcProvider } from "starknet";
import { useAccount } from "@starknet-react/core";
import { polycoinAbi } from "./polycoin_abi";
import { getLow128BitsOfSHA256 } from "../utils/hash";

interface QuestionProps {
  userAddr: string; // Get username from Page.tsx
  userAccount: AccountInterface | null;
}

const Question: React.FC<QuestionProps> = ({ userAddr, userAccount }) => {
  const [question, setQuestion] = useState<Market>({
    id: "",
    title: "",
    description: "",
    expiration: "",
    creator: userAddr, // Default to user address
    bets: [],
    totalAmount: 0,
  });

  const [questions, setQuestions] = useState<Market[]>([]); // Store submitted questions
  const contractAddress =
    "0x014d6c3664f25b6d4cae0a144d769a69920f731b8cb8e8ff45f2e3870a4deddd"; // Poloycoin without owner constraint
  //  "0x00e1dd7b59ee3adb432e3704ef925cf096ce5b64507abc1f486308abaf79e585"; // Polycoin
  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_8",
  });

  const abi = polycoinAbi;

  const contract = new Contract(abi, contractAddress, provider);

  /* const { account } = useAccount();
  console.log("Account:", account); // Debugging log */

  const fetchNextQuestionId = async (): Promise<string | null> => {
    try {
      const response = await fetch("http://localhost:4000/api/next-market-id");
      if (!response.ok) throw new Error("Failed to fetch question ID");

      const data = await response.json(); // Ensure response is JSON
      console.log("Next Question ID:", data.nextId); // Debugging log
      return data.nextId || null;
    } catch (error) {
      console.error("Error fetching question ID:", error);
      return null;
    }
  };

  // 🔹 Fetch all submitted questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/markets");
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 🔹 Shorten displayed address
  //  const shortenedAddress = useMemo(() => {
  //    if (!userAddr) return "";
  //    return `${userAddr.slice(0, 6)}...${userAddr.slice(-4)}`;
  //  }, [userAddr]);

  // 🔹 Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fetch next ID before submitting
    const nextId = await fetchNextQuestionId();
    console.log("Next Question ID:", nextId); // ✅ Print the nextId for debugging
    if (!nextId) {
      alert("Failed to get next question ID");
      return;
    }

    const newQuestion: Market = { ...question, id: nextId };

    try {
      const response = await fetch("http://localhost:4000/api/save-market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions([...questions, newQuestion]);
        setQuestion({
          id: "",
          title: "",
          description: "",
          expiration: "",
          creator: userAddr,
          bets: [],
          totalAmount: 0,
        });
        alert("Question created successfully!");
      } else {
        alert("Failed to save question.");
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
    if (userAccount) {
      contract.connect(userAccount);
    } else {
      alert("Please connect your account first.");
      return;
    }
    const timestamp: bigint = BigInt(Date.now());
    const expirationTimestamp: bigint = BigInt(
      new Date(question.expiration).getTime(),
    );
    if (expirationTimestamp <= timestamp) {
      alert("Expiration date must be in the future.");
      return;
    }
    if (!userAddr) {
      alert("User address is not available.");
      return;
    }

    const titleHash = await getLow128BitsOfSHA256(question.title);
   
    const myCall = contract.populate("create_question", [
      titleHash,
      expirationTimestamp,
      timestamp,
      userAddr,
    ]);

    const res = await contract.create_question(myCall.calldata);
    alert("Create question successfully!");
    await provider.waitForTransaction(res.transaction_hash);
    alert("Transaction sent successfully!");
  };

  return (
    <div className="mt-6 p-4 bg-blue-200 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-fuchsia-600 bg-white">
        Submit a New Question
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={question.title}
          onChange={handleChange}
          placeholder="Enter question title"
          className="w-full p-2 border rounded text-gray-700 bg-white"
          required
        />
        <textarea
          name="description"
          value={question.description}
          onChange={handleChange}
          placeholder="Enter question description"
          className="w-full p-2 border rounded  text-gray-700 bg-white"
        />
        <input
          type="date"
          name="expiration"
          value={question.expiration}
          onChange={handleChange}
          className="w-full p-2 border rounded  text-gray-700 bg-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Submitted Questions:</h3>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q.id} className="p-2 border rounded bg-white">
                <strong>{q.title}</strong> (Expires: {q.expiration})
                <p className="text-gray-600">{q.description}</p>
                <p className="text-gray-400">
                  Created by:{" "}
                  {`${q.creator.slice(0, 6)}...${q.creator.slice(-4)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Question;
