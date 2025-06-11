import React, { useEffect, useState } from "react";

import axios from "axios";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: ""
  });

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/events");
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const applyFilters = () => {
    const { category, location, date } = filters;
    let filtered = [...events];

    if (category) {
      filtered = filtered.filter(event =>
        event.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter(event => event.date === date);
    }

    setFilteredEvents(filtered);
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: "", location: "", date: "" });
    setFilteredEvents(events);
  };

  const bookTicket = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId || !selectedEvent?.eventID) {
      alert("User ID or Event ID missing!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/api/tickets/book", {
        userId: parseInt(userId),
        eventId: selectedEvent.eventID
      });
      alert("Ticket booked successfully!");
      console.log("Ticket response:", res.data);
    } catch (err) {
      console.error("Error booking ticket:", err);
      alert("Failed to book ticket.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Explore Events</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          placeholder="Filter by Category"
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          placeholder="Filter by Location"
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleInputChange}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={clearFilters}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {/* List or Details */}
      {!selectedEvent ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.eventID}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => setSelectedEvent(event)}
            >
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600">📍 {event.location}</p>
              <p className="text-gray-600">📅 {event.date}</p>
              <p className="text-sm text-blue-500">{event.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
          <button
            className="mb-4 text-blue-600 underline"
            onClick={() => setSelectedEvent(null)}
          >
            ← Back to Events
          </button>
          <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
          <p className="text-gray-700 mb-2">
            <strong>Category:</strong> {selectedEvent.category}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Location:</strong> {selectedEvent.location}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Date:</strong> {selectedEvent.date}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Organizer:</strong> {selectedEvent.organizerID}
          </p>
          <button
            onClick={bookTicket}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Book Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
