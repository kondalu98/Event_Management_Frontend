import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: "", category: "", location: "", date: "" ,organizerID:""});

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
      setNewEvent({ name: "", category: "", location: "", date: "" ,organizerID:""});
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

  

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Event Management Dashboard</h2>

      {/* Add Event Section */}
      <div className="p-4 bg-white rounded shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">Add New Event</h3>
        <div className="grid grid-cols-4 gap-2">
          {["name", "category", "location", "date","OrganizerID"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newEvent[field]}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
            />
          ))}
        </div>
        <button onClick={addEvent} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Event
        </button>
      </div>

      {/* Total Events */}
      <div className="text-center text-lg font-semibold mb-4">Total Events: {events.length}</div>

      {/* Event List */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2">Event List</h3>
        {events.length === 0 ? (
          <p className="text-red-600 text-center">No events available.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.eventID} className="p-2 bg-gray-200 rounded flex justify-between items-center">
                <div>
                  <strong>{event.name}</strong> - {event.category} | 📅 {event.date} | 📍 {event.location}
                </div>
                <div className="flex space-x-2">
                  <button  className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button onClick={() => deleteEvent(event.eventID)} className="bg-red-600 text-white px-3 py-1 rounded flex items-center">
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
