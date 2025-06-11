import { useState, useEffect } from "react";

// Assuming these paths are correct for your images
import img_1 from './Assests/slide_1.avif';
import img_2 from './Assests/slide_2.avif';

// Your array of images
const images = [
  img_1,
  img_2,
  img_1, // Duplicating for more slides in example
  img_2
];

function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Effect for automatic sliding (autoplay)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-[100vw] mx-auto px-2 py-2 sm:px-4">
      {/* Image Display */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-36 sm:h-48 md:h-56 lg:h-64 xl:h-72 object-cover transition-all duration-700 ease-in-out transform scale-100 hover:scale-105"
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-60 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-60 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-orange-500 w-6" : "bg-gray-400"
            } hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default EventCarousel;
