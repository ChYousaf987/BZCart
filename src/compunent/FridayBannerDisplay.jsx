import React, { useEffect, useState } from "react";
import axios from "axios";

const FridayBannerDisplay = () => {
  const [banner, setBanner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const API = "http://localhost:3003/api/friday-banner";

  // Fetch banner from backend
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await axios.get(API);
        setBanner(data);

        if (data.timer) {
          const endTime = new Date(data.timer).getTime();
          const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance <= 0) {
              setTimeLeft("Deal Ended");
              clearInterval(timerInterval);
            } else {
              const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );
              const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
              );
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
              setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
          };

          updateTimer(); // initial call
          const timerInterval = setInterval(updateTimer, 1000);
          return () => clearInterval(timerInterval);
        }
      } catch (err) {
        console.error("Failed to load Friday Banner:", err);
      }
    };

    fetchBanner();
  }, []);

  if (!banner) return null;

  return (
    <div className="relative w-[97%] mx-auto my-6 overflow-hidden rounded-lg shadow-lg">
      {/* Video or Image */}
      {banner.video ? (
        <video
          src={`data:video/mp4;base64,${banner.video}`}
          autoPlay
          loop
          muted
          className="w-full h-auto object-cover"
        />
      ) : (
        <img
          src={`data:image/jpeg;base64,${banner.image}`}
          alt={banner.title || "Friday Banner"}
          className="w-full h-auto object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
        {banner.title && (
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {banner.title}
          </h2>
        )}

        {timeLeft && (
          <div className="text-lg md:text-2xl font-semibold text-yellow-400 mb-4">
            {timeLeft}
          </div>
        )}

        {banner.buttonText && banner.buttonLink && (
          <a
            href={banner.buttonLink}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            {banner.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default FridayBannerDisplay;
