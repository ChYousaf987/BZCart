import React, { useEffect, useState } from "react";
import axios from "axios";

const FridayBannerDisplay = () => {
  const [banner, setBanner] = useState(null);
  const [animateSec, setAnimateSec] = useState(false);

  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const API = "https://bzbackend.online/api/friday-banner";

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await axios.get(API);
        if (!data) return;

        if (data.timer && new Date(data.timer).getTime() < Date.now()) return;

        setBanner(data);

        if (data.timer) {
          const endTime = new Date(data.timer).getTime();

          const format = (num) => (num < 10 ? "0" + num : num);

          const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance <= 0) {
              setTime({
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
              });
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

              // Trigger animation only when seconds change
              setAnimateSec(true);
              setTimeout(() => setAnimateSec(false), 300);

              setTime({
                days: format(days),
                hours: format(hours),
                minutes: format(minutes),
                seconds: format(seconds),
              });
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
      {/* Banner Section */}
      <a
        href={banner.buttonLink || "#"}
        className="relative w-[97%] mx-auto overflow-hidden rounded-lg shadow-lg block"
        rel="noopener noreferrer"
      >
        {banner.videoUrl ? (
          <video
            src={banner.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
          />
        ) : banner.video ? (
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

        <div className="absolute inset-0 flex flex-col justify-between text-center p-4">
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

      {/* Countdown Timer */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex justify-center items-center gap-3">
          {/* Days */}
          <div className="flex flex-col gap-2">
            <div className="p-20 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-6xl font-bold">{time.days}</span>
            </div>

            <div className="p-5 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-xl font-semibold tracking-wide">DAYS</span>
            </div>
          </div>

          {/* Hours / Min / Sec */}
          <div className="flex flex-col gap-1">
            {/* Hours */}
            <div className="p-3 px-10 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold">{time.hours}</span>
            </div>
            <div className="p-1 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-sm font-semibold">HOURS</span>
            </div>

            {/* Minutes */}
            <div className="p-3 px-10 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold">{time.minutes}</span>
            </div>
            <div className="p-1 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-sm font-semibold">MINUTES</span>
            </div>

            {/* Seconds with flip animation */}
            <div
              className={`p-3 px-10 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center ${
                animateSec ? "flip" : ""
              }`}
            >
              <span className="text-4xl font-bold">{time.seconds}</span>
            </div>
            <div className="p-1 bg-orange-50 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-sm font-semibold">SECONDS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FridayBannerDisplay;
