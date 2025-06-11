import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EventCarousel from "../Home/EventCarousel";
import EventsDisplaySection from "../Home/EventsDisplaySection";
function NewNav() {
 
  const [searchTerm, setSearchTerm] = useState("");
  
  const [allEvents, setAllEvents] = useState([]);
  
  const [searchResults, setSearchResults] = useState([]);

  const [showSearchResultsDropdown, setShowSearchResultsDropdown] = useState(false);

  // State for Location selection and its dropdown
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [activeLocationFilter, setActiveLocationFilter] = useState(null); // Stores the chosen location as the *fixed* filter
  const [showLocationListDropdown, setShowLocationListDropdown] = useState(false); // Visibility for location list dropdown

  const apiUrl = `http://localhost:8082`;

  // Refs to detect clicks outside dropdowns to close them
  const locationDropdownRef = useRef(null);
  const searchBarRef = useRef(null); // Controls the main search input and its dropdown

  // Effect to fetch all events and extract unique locations on component mount
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/events`)
      .then((res) => {
        setAllEvents(res.data);
        const locations = [...new Set(res.data.map((event) => event.location))];
        setUniqueLocations(locations.filter(Boolean)); // Filter out any empty/null locations
      })
      .catch((error) => {
        console.error("Error fetching events or locations:", error);
      });
  }, [apiUrl]);

  // Effect to handle filtering logic for the main search bar dropdown
  useEffect(() => {
    // If searchTerm is empty, no results should be shown in the dropdown
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowSearchResultsDropdown(false);
      return;
    }

    let filtered = allEvents; // Start with all events

    // Step 1: Apply fixed location filter if one is active
    if (activeLocationFilter) {
      filtered = filtered.filter(
        (event) => event.location.toLowerCase() === activeLocationFilter.toLowerCase()
      );
    }

    // Step 2: Apply search term filter (always by event name)
    // This will now apply to the `filtered` set from the location step
    filtered = filtered.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
    // Show dropdown only if there's an active search term
    setShowSearchResultsDropdown(searchTerm.trim() !== "");

  }, [searchTerm, activeLocationFilter, allEvents]); // Dependencies for this effect

  // Handler for input change in the main search bar
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowLocationListDropdown(false); // Close location list dropdown if typing
  };

  // Handler for opening/closing the unique locations list dropdown
  const handleLocationDropdownToggle = () => {
    setShowLocationListDropdown((prev) => !prev);
    // Close main search results dropdown when opening location list
    setShowSearchResultsDropdown(false);
  };

  // Handler for selecting a location from the unique locations list
  const handleLocationSelect = (locationName) => {
    setActiveLocationFilter(locationName); // Set the chosen location as the *fixed* filter
    setShowLocationListDropdown(false); // Close the unique locations list dropdown
    setSearchTerm(""); // IMPORTANT: Clear search bar when new location is selected
    setShowSearchResultsDropdown(false); // Hide results dropdown
  };

  // Handler for clearing the active location filter
  const handleClearLocationFilter = () => {
    setActiveLocationFilter(null);
    setSearchTerm(""); // Clear search term as well
    setShowSearchResultsDropdown(false); // Hide the main search results dropdown
  };

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close location list dropdown
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationListDropdown(false);
      }
      // Close main search results dropdown
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSearchResultsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
    <nav className="bg-[#F8F9FA] border-b border-[#E0E0E0] dark:bg-[#1A202C] w-full">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-3 py-2 sm:py-3">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center gap-2">
          {/* <img src={Logo} className="h-6 w-16 sm:h-8 sm:w-20 md:h-10 md:w-24 transition-all duration-300" alt="EVNTIFY" /> */}
          <span className="text-base sm:text-lg md:text-xl font-semibold dark:text-white hidden sm:block">
            EVNTIFY
          </span>
        </Link>

        {/* Main Search Bar (Filters by name within selected location, or all names) */}
        <div className="relative flex-1 mx-2 sm:mx-4 md:mx-6 lg:mx-8" ref={searchBarRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="block w-full p-2.5 pl-10 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            placeholder={activeLocationFilter ? `Search event names in ${activeLocationFilter}...` : "Search Events by Name..."}
            onFocus={() => {
              // Only show dropdown if there's a search term
              if (searchTerm.trim() !== "") {
                setShowSearchResultsDropdown(true);
              }
              setShowLocationListDropdown(false); // Close location list dropdown
            }}
          />
          <div className="absolute inset-y-0 left-2 flex items-center text-gray-500">
            🔍
          </div>

          {/* Main Search Results Dropdown */}
          {showSearchResultsDropdown && (
            <div className="absolute top-11 sm:top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((event) => (
                  <Link
                    to={`/events/${event.id}`}
                    key={event.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => {
                      setShowSearchResultsDropdown(false);
                      // activeLocationFilter persists here
                      setSearchTerm(""); // Clear search term after navigating
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm sm:text-base">
                        {event.name}
                      </span>
                    </div>
                    {/* Always show location if different from active filter, or if no active filter */}
                    {(!activeLocationFilter || event.location !== activeLocationFilter) && (
                        <span className="text-xs text-gray-500">
                            ({event.location})
                        </span>
                    )}
                  </Link>
                ))
              ) : (
                <p className="p-2 text-center text-gray-500 text-sm">
                  {activeLocationFilter
                    ? (searchTerm.trim() !== "" ? `No event "${searchTerm}" found in ${activeLocationFilter}.` : "Type an event name to search in this location.")
                    : (searchTerm.trim() !== "" ? `No events found matching "${searchTerm}".` : "Start typing to search for events.")
                  }
                </p>
              )}
            </div>
          )}
        </div>

        {/* Location Dropdown Nav Item */}
        <div className="relative ml-2" ref={locationDropdownRef}>
          <button
            type="button"
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300"
            onClick={handleLocationDropdownToggle}
          >
            {activeLocationFilter ? `${activeLocationFilter} ▼` : "Locations ▼"} {/* Dynamic button text */}
          </button>

          {/* Unique Locations List Dropdown */}
          {showLocationListDropdown && (
            <div className="absolute top-11 sm:top-12 right-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {uniqueLocations.length > 0 ? (
                uniqueLocations.map((location) => (
                  <div
                    key={location}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-2 text-sm">
                  No locations available
                </p>
              )}
              {activeLocationFilter && ( // Option to clear location filter
                <button
                  onClick={handleClearLocationFilter}
                  className="w-full text-center p-2 text-blue-600 hover:bg-gray-100 text-sm border-t mt-1"
                >
                  Clear Location Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login/Signup Button */}
        <Link to="/login" className="ml-2">
          <button
            type="button"
            className="text-white bg-[#ff6726] hover:bg-[#FFB74D] focus:ring-2 focus:outline-none focus:ring-[#ff8080] rounded-md text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 font-semibold transition-all duration-300"
          >
            Login/Sign up
          </button>
        </Link>
      </div>
    </nav>
    <EventCarousel></EventCarousel>
    <EventsDisplaySection title="Recommended Events" />
    </>
  );
}

export default NewNav;