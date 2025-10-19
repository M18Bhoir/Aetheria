// src/Voting_System/CreatePoll.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const options = optionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (options.length < 2) return alert("Provide at least 2 options");
    try {
      await axios.post(`${API_URL}/polls`, { question, options });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating poll");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Create Poll</h2>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <textarea
        placeholder="One option per line"
        value={optionsText}
        onChange={(e) => setOptionsText(e.target.value)}
        rows={6}
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 resize-none"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Create
      </button>
    </form>
  );
}
