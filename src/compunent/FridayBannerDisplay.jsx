import React, { useEffect, useState } from "react";
import axios from "axios";

const FridayBannerDisplay = () => {
  const [banner, setBanner] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const API = "https://bzbackend.online/api/friday-banner";

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await axios.get(API);
        if (!data) return;

        // Check if timer is already passed
        if (data.timer && new Date(data.timer).getTime() < Date.now()) return;

        setBanner(data);

        if (data.timer) {
          const endTime = new Date(data.timer).getTime();
          const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance <= 0) {
              setTimeLeft("Deal Ended");
              clearInterval(timerInterval);
            } else {
              const days = Math.floor(distance / (1000 * 60 * 60 * 24));
              const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );
              const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
              );
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
              setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
          }, 1000);

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
    <>
      <a
        href={banner.buttonLink || "#"}
        className="relative w-[97%] mx-auto overflow-hidden rounded-lg shadow-lg block"
        style={{ textDecoration: "none" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Video or Image */}
        {banner.videoUrl ? (
          <video
            src={banner.videoUrl} // Use proper URL from backend
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
          />
        ) : banner.video ? (
          // fallback if backend only gives base64
          <video
            src={`data:video/mp4;base64,${banner.video}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
          />
        ) : (
          <img
            src={`data:image/jpeg;base64,${banner.image}`}
            alt={banner.title}
            className="w-full h-auto object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between text-center p-4">
          {/* Title + Button at top */}
          <div className="flex flex-col items-center mt-2">
            {banner.title && (
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {banner.title}
              </h2>
            )}
            {banner.buttonText && (
              <div className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md mt-3">
                {banner.buttonText}
              </div>
            )}
          </div>
        </div>
      </a>

      {/* Timer */}
      {timeLeft && (
        <div className="text-2xl text-center font-semibold text-red-500 drop-shadow-lg bg-white/70 px-4 py-1 rounded mt-2">
          {timeLeft}
        </div>
      )}
    </>
  );
};

export default FridayBannerDisplay;
