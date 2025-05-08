import { useState, useEffect } from "react";
import { Market } from "./types";
import { Abi, RpcProvider } from "starknet";
import { useAccount, useContract } from "@starknet-react/core";

interface QuestionProps {
  userAddr: string; // Get username from Page.tsx
}

const Question: React.FC<QuestionProps> = ({ userAddr }) => {
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
    "0x00e1dd7b59ee3adb432e3704ef925cf096ce5b64507abc1f486308abaf79e585";
  const provider = new RpcProvider();
  const [testAbi, setTestAbi] = useState<Abi | undefined>(undefined);

  useEffect(() => {
    const fetchAbi = async () => {
      try {
        const { abi } = await provider.getClassAt(contractAddress);
        if (!abi) {
          throw new Error("no abi.");
        }
        setTestAbi(abi); // save the ABI to state
      } catch (err) {
        console.error("Failed to fetch ABI", err);
      }
    };

    fetchAbi();
  }, [contractAddress]);

  const { contract } = useContract({
    abi: testAbi ?? [],
    address: contractAddress,
  });
  console.log(typeof contract);
  const { account } = useAccount();
  console.log("Account:", account); // Debugging log

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
    /* const timestamp: bigint = BigInt(Date.now());
    const expirationTimestamp: bigint = BigInt(
      new Date(question.expiration).getTime(),
    );
    if (expirationTimestamp <= timestamp) {
      alert("Expiration date must be in the future.");
      return;
    }
    
    const callData = contract.populate("create_question", [userAddr, question.title, expirationTimestamp, timestamp]);
    if (!account) {
      alert("Account is not connected.");
      return;
    }
    const { transaction_hash } = await account.execute([callData]);
    console.log("Transaction hash:", transaction_hash);
    alert("Transaction sent successfully!"); */

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
