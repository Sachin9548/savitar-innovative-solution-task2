import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState(""); // For new feedback input
  const [submittedFeedback, setSubmittedFeedback] = useState(""); // For displaying the feedback
  const [feedbackId, setFeedbackId] = useState(null); // For existing feedback id if editing
  const [error, setError] = useState(""); // Error handling

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem("token");
      // if (!token) return;

      try {
        // Get feedback for the logged-in user (Employee)
        const response = await axios.get("/api/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if feedback exists for the employee
        if (response.data && response.data.length > 0) {
          setFeedbackId(response.data[0]._id);
          setSubmittedFeedback(response.data[0].feedbackText);
          setFeedback(response.data[0].feedbackText); // Pre-fill with existing feedback if present
        } else {
          setSubmittedFeedback("No feedback submitted yet.");
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
        // Edit existing feedback (PUT request)
        await axios.put(
          `/api/feedback/${feedbackId}`,
          feedbackData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Submit new feedback (POST request)
        await axios.post("/api/feedback", feedbackData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSubmittedFeedback(feedback); // Update the displayed feedback

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
        <button type="submit">{feedbackId ? "Update Feedback" : "Submit Feedback"}</button>
      </form>

      <h3>Your Submitted Feedback:</h3>
      <p>{submittedFeedback}</p>
    </div>
  );
};

export default FeedbackPage;
