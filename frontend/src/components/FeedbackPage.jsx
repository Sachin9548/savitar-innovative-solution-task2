import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState("");
  const [feedbackId, setFeedbackId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("/api/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setFeedbackId(response.data._id);
          setSubmittedFeedback(response.data.feedbackText);
        }
      } catch (err) {
        setError("Failed to load feedback");
      }
    };

    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const feedbackData = { feedbackText: feedback };

    try {
      if (feedbackId) {
        await axios.put(
          `/api/feedback/${feedbackId}`,
          feedbackData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("/api/feedback", feedbackData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSubmittedFeedback(feedback);
    } catch (err) {
      setError("Failed to submit feedback");
    }
  };

  return (
    <div>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type your feedback here..."
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Submit Feedback</button>
      </form>

      <h3>Your Submitted Feedback:</h3>
      <p>{submittedFeedback || "No feedback submitted yet."}</p>
    </div>
  );
};

export default FeedbackPage;
