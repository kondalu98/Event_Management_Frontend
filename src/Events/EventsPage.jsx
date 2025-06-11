// Inside your EventsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Get the current location object

  // Base URL for your API
  const apiUrl = "http://localhost:8082";
  const eventsApiUrl = `${apiUrl}/api/events`;

  // State for filters, initialized from URL query params
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      category: params.get("category") || "",
      location: params.get("location") || "", // Read 'location' from URL
      date: params.get("date") || ""
    };
  });

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(eventsApiUrl);
        setEvents(res.data);
        // Apply filters once events are fetched, including the one from URL
        applyFilters(res.data, filters);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [eventsApiUrl]);

  // Effect to re-apply filters when URL changes or filters state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      category: params.get("category") || "",
      location: params.get("location") || "",
      date: params.get("date") || ""
    };
    setFilters(newFilters); // Update internal filter state from URL
    applyFilters(events, newFilters); // Apply filters to current events
  }, [location.search, events]); // Depend on location.search and events

  // Modified applyFilters to take events and filters as arguments
  const applyFilters = (eventsToFilter, currentFilters) => {
    const { category, location, date } = currentFilters;
    let currentFiltered = [...eventsToFilter];

    if (category) {
      currentFiltered = currentFiltered.filter((event) =>
        event.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (location) {
      currentFiltered = currentFiltered.filter((event) =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (date) {
      currentFiltered = currentFiltered.filter((event) => event.date === date);
    }

    setFilteredEvents(currentFiltered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // You might want to apply filters immediately on input change or
    // only on "Apply" button click. For now, it will update when URL changes.
  };

  const handleApplyButtonClick = () => {
    // Manually construct and navigate to the new URL with updated filters
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.date) params.set("date", filters.date);
    // Use replace to avoid adding multiple history entries for filter changes
    window.history.replaceState(null, '', `?${params.toString()}`);
    // Then apply filters based on the new URL (which useEffect will catch)
  };


  const clearFilters = () => {
    setFilters({ category: "", location: "", date: "" });
    // Clear URL parameters
    window.history.replaceState(null, '', '/events');
    // applyFilters will be called by useEffect due to location.search change
  };

  if (loading) {
    return <div className="text-center p-6">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

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
          onClick={handleApplyButtonClick} // Use new handler
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply
        </button>
        <button
          onClick={clearFilters}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Clear
        </button>
      </div>

      {/* List of Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer transition block"
            >
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600">📍 {event.location}</p>
              <p className="text-gray-600">📅 {event.date}</p>
              <p className="text-sm text-blue-500">{event.category}</p>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No events found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;