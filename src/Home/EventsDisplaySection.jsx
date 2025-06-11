import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
import event_1 from './Assests/event_1.jpg';
// Base URL for your API
const apiUrl = `http://localhost:8082`; // Ensure this matches your backend API URL

function EventsDisplaySection({ title = "Recommended Events", category = "" }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null); // Ref for the scrollable div

  // Fallback image if event.imageUrl is not provided manually
  const defaultImageUrl = event_1;

  useEffect(() => {
    let endpoint = `${apiUrl}/api/events`;
    if (category) {
      // If a category is provided, fetch events by category
      endpoint = `${apiUrl}/api/events/category?category=${category}`;
    }

    axios.get(endpoint)
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching events for ${category || 'all'} events row:`, err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      });
  }, [category]); // Re-fetch data when the category prop changes

  // Function to scroll the container left or right
  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  // --- Loading, Error, and Empty States ---
  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto py-8 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="flex justify-center items-center h-32 text-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="ml-3">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto py-8 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="text-center text-red-600 p-4">{error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto py-8 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="text-center text-gray-600 p-4">No {category ? category.toLowerCase() : ''} events available to display.</div>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="relative max-w-screen-xl mx-auto py-8 px-4">
      {/* Section Header with title and "See All" link */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <Link 
          to={category ? `/events/category/${category}` : "/events"} // Adjust target path based on category
          className="text-orange-600 hover:text-orange-800 font-semibold text-sm sm:text-base"
        >
          See All &gt;
        </Link>
      </div>

      {/* Scrollable Container for Event Cards */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 snap-x snap-mandatory" // `scrollbar-hide` requires `tailwind-scrollbar-hide` plugin
        >
          {events.map((event) => (
            // Individual Event Card (embedded directly)
            <div key={event.id} className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] snap-start">
              <Link to={`/events/${event.id}`} className="block h-full">
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                  {/* Event Image */}
                  <div className="relative w-full aspect-[2/3] bg-gray-200"> {/* Forces 2:3 aspect ratio */}
                    <img
                      src={event.imageUrl || defaultImageUrl}
                      alt={event.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Optional: Overlay for likes/votes - adapt to your event data */}
                    {event.likes && ( // Example: if your Event entity has a 'likes' field
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        ⭐ {event.likes} Likes
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        📍 {event.location}
                      </p>
                      {event.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          🗓️ {new Date(event.date).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                          {event.time && ` @ ${event.time}`} {/* Display time if available */}
                        </p>
                      )}
                    </div>
                    {/* Optional: Add category or genre display */}
                    {event.category && (
                      <p className="text-xs text-gray-500 mt-2">
                        {event.category}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (visible on medium screens and up) */}
        <button
          onClick={() => scroll(-250)} // Scroll left by 250px
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-opacity z-10 hidden md:block focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll(250)} // Scroll right by 250px
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-opacity z-10 hidden md:block focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EventsDisplaySection;