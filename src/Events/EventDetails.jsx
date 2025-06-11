
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventId } = useParams(); 
  const navigate = useNavigate(); 

  const apiUrl = "http://localhost:8082";

   useEffect(() => {
    if (!eventId) {
      setError("No event ID provided.");
      setLoading(false);
      return;
    }
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, apiUrl]);

  

  if (loading) {
    return <div className="text-center p-6">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  if (!event) {
    return <div className="text-center p-6">Event not found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto my-8">
      <button
        className="mb-4 text-blue-600 underline hover:text-blue-800"
        onClick={() => navigate("/")} 
      >
        ← Back to Home
      </button>
      <h2 className="text-3xl font-bold mb-3">{event.name}</h2>
      <p className="text-gray-700 mb-2">
        <strong>Category:</strong> {event.category}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Date:</strong> {event.date}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Organizer:</strong> {event.organizerID}
      </p>
      <button
 
      className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition duration-300 ease-in-out text-lg font-semibold"
      >
        Book Ticket
      </button>
    </div>
  );
};

export default EventDetails;