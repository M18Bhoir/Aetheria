// src/Voting_System/CreatePoll.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Corrected import path
import api from "../utils/api";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [message, setMessage] = useState(null); // Added for feedback
  const [loading, setLoading] = useState(false); // Added for loading state
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    const options = optionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean); // Filter out empty lines

    if (!question.trim()) {
      setMessage({ type: 'error', text: 'Please enter a question.' });
      return;
    }
    if (options.length < 2) {
      setMessage({ type: 'error', text: 'Please provide at least 2 valid options (one per line).' });
      return;
    }

    setLoading(true); // Set loading state

    try {
      // Use the configured api instance and /api prefix
      const response = await api.post(`/api/polls`, {
        question,
        // Send options as an array of objects as expected by the backend schema
        options: options.map(text => ({ text: text }))
       });

      console.log("Poll created:", response.data);
      setMessage({ type: 'success', text: 'Poll created successfully! Redirecting...' });

      // Navigate to the main poll list within the dashboard layout
      setTimeout(() => navigate("/dashboard/voting"), 1500);

    } catch (err) {
      console.error("Error creating poll:", err);
       if (err.message === "Unauthorized access - Redirecting to login.") { return; } // Handled by interceptor

      let errorMessage = "Error creating poll.";
      if (err.response) {
          errorMessage = err.response.data?.message || err.response.data?.msg || "An error occurred on the server.";
          // Keep the 401 message simple as redirect is handled
          if (err.response.status === 401) errorMessage = "Authentication error.";
      } else if (err.request) {
          errorMessage = "Could not connect to the server. Please check your network.";
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
        setLoading(false); // Reset loading state
    }
  };

  // --- JSX remains largely the same ---
  // Added message display area and loading state for button
  return (
    <div className="container mx-auto mt-6 p-4">
        <form
        onSubmit={onSubmit}
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto"
        >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create a New Poll</h2>

         {/* Message Display Area */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-sm font-medium ${
                message.type === "error"
                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              }`}
            >
              {message.text}
            </div>
          )}

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
            disabled={loading} // Disable button when loading
            className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
        >
             {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
              ) : (
                'Create Poll'
              )}
        </button>
        </form>
    </div>
  );
}