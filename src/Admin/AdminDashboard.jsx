import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: "", category: "", location: "", date: "", organizerID: "" });
  const [editingEvent, setEditingEvent] = useState(null); // event being edited

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const addEvent = async () => {
    try {
      const res = await axios.post("http://localhost:8082/api/events", newEvent);
      setEvents([...events, res.data]);
      setNewEvent({ name: "", category: "", location: "", date: "", organizerID: "" });
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/api/events/${id}`);
      setEvents(events.filter((event) => event.eventID !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const updateEvent = async () => {
    try {
      const res = await axios.put(`http://localhost:8082/api/events/${editingEvent.eventID}`, editingEvent);
      setEvents(events.map((ev) => (ev.eventID === editingEvent.eventID ? res.data : ev)));
      setEditingEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingEvent({ ...editingEvent, [e.target.name]: e.target.value });
  };
 const navigate = useNavigate();
  const handleLogout = () => {
navigate("/admin")
};

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-100 rounded shadow-md">

    <div className="flex justify-end mb-4">
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>
      <h2 className="text-2xl font-bold text-center mb-4">Event Management Dashboard</h2>

      {/* Add Event Form */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {["name", "category", "location", "date", "organizerID"].map((field) => (
            <input
              key={field}
              type={field === "date" ? "date" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newEvent[field]}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
            />
          ))}
        </div>
        <button
          onClick={addEvent}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Event
        </button>
      </div>

      {/* Event List */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2">Event List (Total: {events.length})</h3>
        {events.length === 0 ? (
          <p className="text-center text-gray-500">No events available.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) =>
              editingEvent && editingEvent.eventID === event.eventID ? (
                <li key={event.eventID} className="p-3 bg-gray-100 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {["name", "category", "location", "date", "organizerID"].map((field) => (
                      <input
                        key={field}
                        type={field === "date" ? "date" : "text"}
                        name={field}
                        value={editingEvent[field]}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button onClick={updateEvent} className="bg-green-600 text-white px-3 py-1 rounded flex items-center">
                      <FaSave className="mr-1" /> Save
                    </button>
                    <button
                      onClick={() => setEditingEvent(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaTimes className="mr-1" /> Cancel
                    </button>
                  </div>
                </li>
              ) : (
                <li key={event.eventID} className="p-3 bg-gray-200 rounded flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-2 md:mb-0">
                    <strong>{event.name}</strong> — {event.category} | 📍 {event.location} | 📅 {event.date}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event.eventID)}
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
