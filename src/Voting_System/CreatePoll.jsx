// src/Voting_System/CreatePoll.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// --- FIX: Import the shared api instance ---
import api from "../api"; // Adjust the path if api.js is in a different directory

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const options = optionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean); // Filter out empty lines

    if (!question.trim()) return alert("Please enter a question.");
    if (options.length < 2) return alert("Provide at least 2 valid options (one per line).");

    try {
      // --- FIX: Use the configured api instance ---
      const response = await api.post(`/polls`, { question, options });
      console.log("Poll created:", response.data);
      // Navigate to the main poll list or the newly created poll's detail page
      navigate("/voting"); // Or navigate(`/poll/${response.data._id}`) if backend returns the new poll object with _id
    } catch (err) {
      console.error("Error creating poll:", err);
      // Provide more specific feedback based on error response
      let errorMessage = "Error creating poll.";
      if (err.response) {
          if (err.response.status === 401) {
              errorMessage = "Authentication error. Please log in again.";
              // Optionally redirect to login: navigate('/login');
          } else {
              errorMessage = err.response.data?.msg || "An error occurred on the server.";
          }
      } else if (err.request) {
          errorMessage = "Could not connect to the server. Please check your network.";
      }
      alert(errorMessage);
    }
  };

  return (
    // Assuming this component might be rendered within a layout that provides the dark mode context
    // If used standalone, you might need to wrap it or add bg/text colors directly
    <div className="container mx-auto mt-6 p-4">
        <form
        onSubmit={onSubmit}
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto"
        >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create a New Poll</h2>
        <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poll Question</label>
            <input
            id="question"
            placeholder="What do you want to ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="mb-6">
             <label htmlFor="options" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Options (One per line, at least 2)</label>
            <textarea
            id="options"
            placeholder="Option 1\nOption 2\nOption 3..."
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            rows={5}
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
            Create Poll
        </button>
        </form>
    </div>
  );
}