import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]); // List of all feedbacks
  const [error, setError] = useState(""); // Error handling

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        // Get all feedbacks (Admin access)
        const response = await axios.get("/api/feedback/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data);
      } catch (err) {
        setError("Failed to load feedbacks");
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (feedbackId) => {
    const token = localStorage.getItem("token");
    try {
      // Delete feedback by ID (Admin access)
      await axios.delete(`/api/feedback/admin/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove feedback from state after successful delete
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId));
    } catch (err) {
      setError("Failed to delete feedback");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>All Feedback</h3>
      <ul>
        {feedbacks.length === 0 && <p>No feedbacks available</p>}
        {feedbacks.map((feedback) => (
          <li key={feedback._id}>
            <p>{feedback.feedbackText}</p>
            <button onClick={() => handleDelete(feedback._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
