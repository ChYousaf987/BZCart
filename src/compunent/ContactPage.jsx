import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields!");
      return;
    }

    emailjs
      .send(
        "your_service_id", // 🔑 replace with EmailJS service ID
        "your_template_id", // 🔑 replace with EmailJS template ID
        formData,
        "your_public_key" // 🔑 replace with EmailJS public key
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (error) => {
          toast.error("Something went wrong, try again!");
          console.error("EmailJS error:", error);
        }
      );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-light font-daraz">
        {/* Header Section */}
        <div className=" text-primary py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-sm md:text-base">
            We’d love to hear from you! Fill out the form below.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto py-12 px-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-dark font-semibold mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-dark font-semibold mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="mt-6">
              <label className="block text-dark font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Message */}
            <div className="mt-6">
              <label className="block text-dark font-semibold mb-2">
                Message*
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="5"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-dark transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
