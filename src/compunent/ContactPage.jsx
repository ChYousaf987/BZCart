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
      <div className="min-h-screen bg-light font-daraz overflow-hidden">
        {/* Header Section */}
        <div className="relative text-center py-12 md:py-20 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-dark/20 opacity-50"></div>
          <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight animate-slideInLeft">
            Let's Connect
          </h1>
          <p className="relative mt-4 text-lg md:text-xl opacity-90 animate-slideInRight">
            Drop us a message, and we'll get back to you soon!
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto py-20 px-6">
          <div className="relative bg-white shadow-2xl rounded-3xl p-12 transform transition-all duration-700 hover:shadow-3xl animate-slideInLeft">
            <div className="absolute top-0 left-0 w-24 h-2 bg-primary rounded-tl-3xl"></div>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div>
                  <label className="block text-dark text-sm font-semibold mb-3 tracking-wide">
                    Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full p-4 bg-light border border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-dark text-sm font-semibold mb-3 tracking-wide">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full p-4 bg-light border border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-dark text-sm font-semibold mb-3 tracking-wide">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full p-4 bg-light border border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-dark text-sm font-semibold mb-3 tracking-wide">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="7"
                  className="w-full p-4 bg-light border border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary resize-none"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  className="relative bg-primary text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:bg-dark transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="relative z-10">Send Message</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-dark opacity-0 hover:opacity-30 rounded-xl transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
